"""
EcoEcho AI Vision Inference & Video Stream Server
=================================================
Uses 'best.pt' YOLO model to run real-time rice pest detection on:
1) Local Webcams (OpenCV cv2.VideoCapture)
2) Browser webcam frames sent via /api/detect (POST)
3) ESP32-CAM HTTP capture stream
4) Image file uploads / sample test images

Model Classes Detected by best.pt:
0: brown-planthopper (Nilaparvata lugens)
1: green-leafhopper (Nephotettix virescens)
2: leaf-folder (Cnaphalocrocis medinalis)
3: rice-bug (Leptocorisa oratorius)
4: stem-borer (Scirpophaga incertulas)
5: whorl-maggot (Hydrellia philippina)
"""

import os
import sys

# Suppress noisy OpenCV / MSMF warning logs on Windows
os.environ["OPENCV_LOG_LEVEL"] = "FATAL"
os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"

import io
import time
import json
import base64
import threading
import requests
import numpy as np
import cv2
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# Configuration & Defaults
DEFAULT_CAMERA_SOURCE = os.environ.get("CAMERA_SOURCE", "webcam").lower()  # 'webcam' or 'esp32'
DEFAULT_WEBCAM_INDEX = int(os.environ.get("WEBCAM_INDEX", 0))
DEFAULT_ESP32_URL = os.environ.get("ESP32_CAM_URL", "http://192.168.100.135/capture")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")
CONFIDENCE_THRESHOLD = float(os.environ.get("CONFIDENCE_THRESHOLD", 0.70))  # 70% Confidence
IMAGE_SIZE = int(os.environ.get("IMAGE_SIZE", 640))

# Scientific names mapping for the 6 exact classes from best.pt
SCIENTIFIC_NAMES = {
    "brown-planthopper": ("Brown Planthopper", "Nilaparvata lugens"),
    "green-leafhopper": ("Green Leafhopper", "Nephotettix virescens"),
    "leaf-folder": ("Leaf Folder", "Cnaphalocrocis medinalis"),
    "rice-bug": ("Rice Bug", "Leptocorisa oratorius"),
    "stem-borer": ("Rice Stem Borer", "Scirpophaga incertulas"),
    "whorl-maggot": ("Whorl Maggot", "Hydrellia philippina"),
}

# State
state = {
    "camera_source": DEFAULT_CAMERA_SOURCE,  # 'webcam' or 'esp32'
    "webcam_index": DEFAULT_WEBCAM_INDEX,
    "esp32_url": DEFAULT_ESP32_URL,
    "confidence_threshold": CONFIDENCE_THRESHOLD,
    "model_loaded": False,
    "last_frame": None,
    "last_annotated_frame": None,
    "last_detections": [],
    "last_inference_time_ms": 0,
    "total_inferences": 0,
    "camera_connected": False,
    "fps": 0,
    "active_mode": "AUTOMATIC",
    "error_message": None
}

# Load YOLO model
print(f"[EcoEcho AI Server] Loading YOLO weights from {MODEL_PATH}...")
try:
    model = YOLO(MODEL_PATH)
    state["model_loaded"] = True
    print(f"[EcoEcho AI Server] Model 'best.pt' loaded successfully!")
    print(f"[EcoEcho AI Server] Target classes: {model.names}")
except Exception as e:
    print(f"[EcoEcho AI Server] Error loading model: {e}")
    model = None


def generate_dummy_paddy_frame():
    """Generates a synthetic green rice paddy frame if camera is offline for demonstration"""
    img = np.zeros((360, 640, 3), dtype=np.uint8)
    for y in range(360):
        ratio = y / 360.0
        g = int(50 + ratio * 60)
        b = int(25 + ratio * 30)
        r = int(18 + ratio * 20)
        img[y, :] = (b, g, r)

    cv2.line(img, (120, 360), (220, 160), (100, 180, 80), 6)
    cv2.line(img, (320, 360), (260, 120), (120, 200, 90), 8)
    cv2.line(img, (480, 360), (540, 140), (90, 170, 70), 7)
    cv2.putText(img, "EcoEcho AI Vision (Camera Standby)", (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 255, 200), 2)
    return img


def process_frame(frame, conf=None):
    """Runs YOLO best.pt inference and formats detections for the EcoEcho frontend"""
    if model is None or frame is None:
        return frame, []

    conf_thresh = conf if conf is not None else state.get("confidence_threshold", 0.70)
    h, w = frame.shape[:2]
    t0 = time.time()
    results = model.predict(frame, imgsz=IMAGE_SIZE, conf=conf_thresh, verbose=False)
    infer_ms = (time.time() - t0) * 1000

    detections = []
    annotated_frame = results[0].plot()

    boxes = results[0].boxes
    if boxes is not None and len(boxes) > 0:
        for idx, box in enumerate(boxes):
            cls_id = int(box.cls[0].item())
            raw_cls_name = model.names.get(cls_id, f"class_{cls_id}").lower()
            conf_val = float(box.conf[0].item())

            # Bounding box in pixels: [x1, y1, x2, y2]
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = xyxy

            # Normalize to percentages for responsive frontend overlay
            pct_x = max(0.0, min(100.0, (x1 / w) * 100.0))
            pct_y = max(0.0, min(100.0, (y1 / h) * 100.0))
            pct_w = max(1.0, min(100.0, ((x2 - x1) / w) * 100.0))
            pct_h = max(1.0, min(100.0, ((y2 - y1) / h) * 100.0))

            pretty_name, scientific = SCIENTIFIC_NAMES.get(
                raw_cls_name, 
                (raw_cls_name.replace("-", " ").title(), "Agricultural Insect")
            )

            is_bph = "planthopper" in raw_cls_name
            action = (
                "Acoustic Jamming Active (42.5 kHz)" 
                if is_bph 
                else "Continuous Sound Sweep Active"
            )

            detections.append({
                "id": f"det-live-{int(time.time() * 1000)}-{idx}",
                "timestamp": time.strftime("%I:%M:%S %p"),
                "pestType": pretty_name,
                "scientificName": scientific,
                "confidence": round(conf_val, 3),
                "bbox": {
                    "x": round(pct_x, 1),
                    "y": round(pct_y, 1),
                    "width": round(pct_w, 1),
                    "height": round(pct_h, 1)
                },
                "actionTaken": action,
                "intensity": "HIGH" if conf_val > 0.80 else "MEDIUM",
                "coordinates": "Field Canopy",
                "isDeterred": is_bph and (state["active_mode"] == "DYNAMIC")
            })

    state["last_detections"] = detections
    state["last_inference_time_ms"] = round(infer_ms, 1)
    state["total_inferences"] += 1

    return annotated_frame, detections


def camera_worker():
    """Continuous background worker to grab frames from Local Webcam or ESP32-CAM and run YOLO"""
    fps_count = 0
    fps_timer = time.time()
    active_cap = None
    current_cap_idx = None
    consecutive_fail_count = 0

    while True:
        source = state["camera_source"]
        is_pushing = (time.time() - state.get("last_push_frame_time", 0)) < 3.0

        # If an ESP32 or client is actively pushing frames to /api/detect, prioritize that stream!
        if is_pushing:
            if active_cap is not None:
                try:
                    active_cap.release()
                except Exception:
                    pass
                active_cap = None
                current_cap_idx = None
            
            state["camera_connected"] = True
            time.sleep(0.04)
            continue

        frame = None

        if source == "webcam":
            webcam_idx = state["webcam_index"]
            # Initialize or recreate capture if index changed or cap closed
            if active_cap is None or current_cap_idx != webcam_idx or not active_cap.isOpened():
                if active_cap is not None:
                    try:
                        active_cap.release()
                    except Exception:
                        pass
                
                print(f"[EcoEcho AI Server] Initializing webcam index {webcam_idx} with DirectShow...")
                if sys.platform.startswith("win"):
                    active_cap = cv2.VideoCapture(webcam_idx, cv2.CAP_DSHOW)
                else:
                    active_cap = cv2.VideoCapture(webcam_idx)
                
                if not active_cap.isOpened():
                    active_cap = cv2.VideoCapture(webcam_idx)

                if active_cap.isOpened():
                    active_cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                    active_cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                    current_cap_idx = webcam_idx
                    state["camera_connected"] = True
                    state["error_message"] = None
                    consecutive_fail_count = 0
                    print(f"[EcoEcho AI Server] ✅ Webcam {webcam_idx} opened successfully!")
                else:
                    current_cap_idx = None
                    state["camera_connected"] = False
                    state["error_message"] = f"Could not open webcam index {webcam_idx}"

            if active_cap is not None and active_cap.isOpened():
                ret, captured = active_cap.read()
                if ret and captured is not None:
                    frame = captured
                    state["camera_connected"] = True
                    state["error_message"] = None
                    consecutive_fail_count = 0
                else:
                    consecutive_fail_count += 1
                    if consecutive_fail_count > 10:
                        state["camera_connected"] = False
                        state["error_message"] = f"Webcam {webcam_idx} not returning frames"
                        time.sleep(0.5)

        elif source == "esp32":
            if active_cap is not None:
                try:
                    active_cap.release()
                except Exception:
                    pass
                active_cap = None
                current_cap_idx = None

            target_url = state["esp32_url"]
            try:
                resp = requests.get(target_url, timeout=2.0)
                if resp.status_code == 200:
                    img_array = np.frombuffer(resp.content, dtype=np.uint8)
                    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                    if frame is not None:
                        state["camera_connected"] = True
                        state["error_message"] = None
            except Exception:
                if state.get("last_annotated_frame") is None:
                    state["camera_connected"] = False
                    state["error_message"] = f"Waiting for ESP32 stream..."

        if frame is not None:
            state["last_frame"] = frame
            annotated, _ = process_frame(frame)
            state["last_annotated_frame"] = annotated
        elif state["last_annotated_frame"] is None:
            state["last_annotated_frame"] = generate_dummy_paddy_frame()

        fps_count += 1
        if time.time() - fps_timer >= 1.0:
            state["fps"] = fps_count
            fps_count = 0
            fps_timer = time.time()

        time.sleep(0.04 if source == "webcam" else 0.1)

        fps_count += 1
        if time.time() - fps_timer >= 1.0:
            state["fps"] = fps_count
            fps_count = 0
            fps_timer = time.time()

        time.sleep(0.04 if source == "webcam" else 0.1)


def start_mqtt_client():
    """Subscribes to Cloud MQTT broker to ingest ESP32 frames in real-time"""
    try:
        import paho.mqtt.client as mqtt_client
    except ImportError:
        print("[EcoEcho AI Server] paho-mqtt not installed; skipping background MQTT listener.")
        return

    mqtt_broker = os.environ.get("MQTT_BROKER", "broker.hivemq.com")
    mqtt_port = int(os.environ.get("MQTT_PORT", 1883))

    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print(f"[EcoEcho AI Server] ☁️ Connected to Cloud MQTT Broker ({mqtt_broker}:{mqtt_port})")
            client.subscribe("ecoecho/+/camera")
            print("[EcoEcho AI Server] 📡 Subscribed to 'ecoecho/+/camera' for live pest vision")
        else:
            print(f"[EcoEcho AI Server] ⚠️ MQTT connection failed with code {rc}")

    def on_message(client, userdata, msg):
        try:
            topic = msg.topic
            payload = msg.payload
            
            parts = topic.split("/")
            device_id = parts[1] if len(parts) > 1 else "ECOECHO-01"

            img = None
            try:
                text = payload.decode("utf-8")
                if text.startswith("data:image"):
                    text = text.split(",", 1)[1]
                img_bytes = base64.b64decode(text)
                nparr = np.frombuffer(img_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception:
                pass

            if img is None:
                nparr = np.frombuffer(payload, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is not None:
                annotated, detections = process_frame(img)
                state["last_frame"] = img
                state["last_annotated_frame"] = annotated
                state["last_push_frame_time"] = time.time()
                state["camera_source"] = "esp32"
                state["camera_connected"] = True

                if detections:
                    det_topic = f"ecoecho/{device_id}/detections"
                    client.publish(det_topic, json.dumps(detections))
        except Exception:
            pass

    client = mqtt_client.Client(client_id=f"ecoecho_ai_server_{int(time.time())}")
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(mqtt_broker, mqtt_port, 60)
        client.loop_start()
    except Exception as e:
        print(f"[EcoEcho AI Server] ⚠️ MQTT connect error: {e}")


# Start background inference thread
worker_thread = threading.Thread(target=camera_worker, daemon=True)
worker_thread.start()

# Start background MQTT ingestion client
mqtt_thread = threading.Thread(target=start_mqtt_client, daemon=True)
mqtt_thread.start()


@app.route("/")
def index():
    return jsonify({
        "app": "EcoEcho AI Vision Inference Server",
        "status": "ONLINE",
        "model": "best.pt",
        "cameraSource": state["camera_source"],
        "webcamIndex": state["webcam_index"],
        "confidenceThreshold": state["confidence_threshold"],
        "esp32Url": state["esp32_url"],
        "cameraConnected": state["camera_connected"],
        "fps": state["fps"],
        "classes": model.names if model else {},
        "endpoints": {
            "detections": "/api/detections",
            "status": "/api/status",
            "annotated_stream": "/api/annotated-stream",
            "latest_frame": "/api/latest-frame",
            "detect": "/api/detect (POST)",
            "config": "/api/config (POST)"
        }
    })


@app.route("/api/status")
def get_status():
    return jsonify({
        "modelLoaded": state["model_loaded"],
        "modelName": "best.pt (YOLO Rice Pest Model)",
        "classes": model.names if model else {},
        "cameraSource": state["camera_source"],
        "webcamIndex": state["webcam_index"],
        "confidenceThreshold": state["confidence_threshold"],
        "esp32Url": state["esp32_url"],
        "cameraConnected": state["camera_connected"],
        "esp32Connected": state["camera_connected"] if state["camera_source"] == "esp32" else False,
        "webcamConnected": state["camera_connected"] if state["camera_source"] == "webcam" else False,
        "fps": state["fps"],
        "lastInferenceMs": state["last_inference_time_ms"],
        "totalInferences": state["total_inferences"],
        "activeDetectionsCount": len(state["last_detections"]),
        "errorMessage": state["error_message"]
    })


@app.route("/api/detections")
def get_detections():
    return jsonify(state["last_detections"])


@app.route("/api/latest-frame")
def get_latest_frame():
    frame = state["last_annotated_frame"]
    if frame is None:
        frame = generate_dummy_paddy_frame()

    _, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 85])
    return Response(buffer.tobytes(), mimetype="image/jpeg")


def mjpeg_generator():
    """Generates multipart MJPEG stream for <img> tag embedding"""
    while True:
        frame = state["last_annotated_frame"]
        if frame is None:
            frame = generate_dummy_paddy_frame()

        _, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        yield (b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n")
        time.sleep(0.04)


@app.route("/api/annotated-stream")
def annotated_stream():
    return Response(mjpeg_generator(), mimetype="multipart/x-mixed-replace; boundary=frame")


@app.route("/api/detect", methods=["GET", "POST"])
def detect_upload():
    """
    Accepts an uploaded image file, JSON base64 frame from browser webcam, or raw bytes
    and runs YOLO best.pt inference at the requested confidence threshold (default 70%).
    Handles GET requests gracefully with API info.
    """
    if request.method == "GET":
        return jsonify({
            "endpoint": "/api/detect",
            "status": "ONLINE",
            "model": "best.pt",
            "confidenceThreshold": f"{state['confidence_threshold']*100:.0f}%",
            "classes": model.names if model else {},
            "usage": "Send a POST request with an image file or JSON { 'image': base64_str } to run pest detection."
        })

    img = None
    custom_conf = None

    try:
        if request.is_json:
            data = request.get_json(silent=True) or {}
            if "confidenceThreshold" in data:
                custom_conf = float(data["confidenceThreshold"])
            if "image" in data:
                b64_str = data["image"]
                if "," in b64_str:
                    b64_str = b64_str.split(",", 1)[1]
                img_bytes = base64.b64decode(b64_str)
                nparr = np.frombuffer(img_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None and "file" in request.files:
            file = request.files["file"]
            if "confidenceThreshold" in request.form:
                custom_conf = float(request.form["confidenceThreshold"])
            img_bytes = file.read()
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None and request.data:
            nparr = np.frombuffer(request.data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        annotated, detections = process_frame(img, conf=custom_conf)
        
        # Update live stream buffer so /api/annotated-stream shows ESP32 frames in real-time
        state["last_frame"] = img
        state["last_annotated_frame"] = annotated
        state["last_push_frame_time"] = time.time()
        state["camera_source"] = "esp32"
        state["camera_connected"] = True
        
        # Encode annotated preview
        _, buffer = cv2.imencode(".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 80])
        annotated_b64 = "data:image/jpeg;base64," + base64.b64encode(buffer).decode("utf-8")

        return jsonify({
            "success": True,
            "model": "best.pt",
            "confidenceThreshold": custom_conf or state["confidence_threshold"],
            "detections": detections,
            "count": len(detections),
            "inferenceMs": state["last_inference_time_ms"],
            "annotatedImage": annotated_b64
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/config", methods=["POST"])
def update_config():
    data = request.get_json(force=True, silent=True) or {}
    if "cameraSource" in data:
        source = str(data["cameraSource"]).lower()
        if source in ["webcam", "esp32"]:
            state["camera_source"] = source
            print(f"[EcoEcho AI Server] Camera source switched to: {source}")
    if "webcamIndex" in data:
        try:
            state["webcam_index"] = int(data["webcamIndex"])
        except ValueError:
            pass
    if "confidenceThreshold" in data:
        try:
            state["confidence_threshold"] = float(data["confidenceThreshold"])
            print(f"[EcoEcho AI Server] Confidence threshold updated to: {state['confidence_threshold']*100:.0f}%")
        except ValueError:
            pass
    if "sensitivityThreshold" in data:
        try:
            state["confidence_threshold"] = float(data["sensitivityThreshold"])
            print(f"[EcoEcho AI Server] Confidence threshold updated to: {state['confidence_threshold']*100:.0f}%")
        except ValueError:
            pass
    if "esp32Url" in data:
        state["esp32_url"] = str(data["esp32Url"])
    if "activeMode" in data:
        state["active_mode"] = str(data["activeMode"])
    
    return jsonify({
        "success": True,
        "cameraSource": state["camera_source"],
        "webcamIndex": state["webcam_index"],
        "confidenceThreshold": state["confidence_threshold"],
        "esp32Url": state["esp32_url"],
        "activeMode": state["active_mode"],
        "cameraConnected": state["camera_connected"]
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    use_ngrok = "--ngrok" in sys.argv or os.environ.get("USE_NGROK", "false").lower() in ("true", "1")
    
    # Check for authtoken argument (e.g. --token=xxxx or NGROK_AUTHTOKEN env)
    token = os.environ.get("NGROK_AUTHTOKEN")
    for arg in sys.argv:
        if arg.startswith("--token="):
            token = arg.split("=", 1)[1]
        elif arg.startswith("--authtoken="):
            token = arg.split("=", 1)[1]

    public_url = None
    if use_ngrok:
        try:
            from pyngrok import ngrok
            if token:
                ngrok.set_auth_token(token)
                print(f"[EcoEcho AI Server] ✅ Ngrok auth token configured.")

            print(f"[EcoEcho AI Server] 🌐 Starting Ngrok secure tunnel on port {port}...")
            tunnel = ngrok.connect(port, "http")
            public_url = tunnel.public_url
            state["public_tunnel_url"] = public_url
            print(f"\n" + "=" * 60)
            print(f"🌍 PUBLIC NGROK TUNNEL ACTIVE!")
            print(f"👉 Public AI Server URL: {public_url}")
            print(f"👉 Point your ESP32 or Remote Dashboard to: {public_url}")
            print(f"=" * 60 + "\n")
        except Exception as e:
            print(f"[EcoEcho AI Server] ⚠️ Ngrok tunnel failed to start: {e}")
            print(f"👉 Tip: To set your free authtoken, run: python ai_server.py --ngrok --token=YOUR_TOKEN\n")

    print(f"\n=======================================================")
    print(f"🚀 EcoEcho AI Inference Server starting on http://127.0.0.1:{port}")
    if public_url:
        print(f"🌐 Remote Public URL: {public_url}")
    print(f"📷 Primary Camera Source: {state['camera_source'].upper()} (Webcam Index: {state['webcam_index']})")
    print(f"🎯 Confidence Threshold: {state['confidence_threshold']*100:.0f}%")
    print(f"📡 ESP32-CAM Target URL: {state['esp32_url']}")
    print(f"🧠 Model: {MODEL_PATH}")
    print(f"=======================================================\n")
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
