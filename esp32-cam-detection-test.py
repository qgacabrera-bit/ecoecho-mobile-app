"""
EcoEcho ESP32-CAM Pest Detection Test & Live Monitor (best.pt)
============================================================
Tests direct local streaming and YOLO inference from the ESP32-CAM.

Usage:
  python esp32-cam-detection-test.py                   # Connects to default http://192.168.4.1/capture
  python esp32-cam-detection-test.py --ip 192.168.1.50 # Connects to custom Wi-Fi IP
  python esp32-cam-detection-test.py --conf 0.60       # Run with 60% confidence threshold
"""

import cv2
import numpy as np
import requests
from ultralytics import YOLO
import time
import os
import argparse
import sys

def normalize_url(raw: str) -> str:
    if not raw:
        return "http://192.168.4.1/capture"
    url = raw.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "http://" + url
    parts = url.split("://", 1)[1]
    if "/" not in parts:
        url = url.rstrip("/") + "/capture"
    return url

parser = argparse.ArgumentParser(description="EcoEcho ESP32-CAM Local Detection Test")
parser.add_argument("--ip", type=str, default=None, help="ESP32 IP or URL (e.g. 192.168.4.1 or 192.168.1.100)")
parser.add_argument("--conf", type=float, default=0.70, help="Confidence threshold (default: 0.70)")
args = parser.parse_args()

raw_target = args.ip or os.environ.get("ESP32_CAM_URL", "192.168.4.1")
ESP32_CAM_URL = normalize_url(raw_target)
CONF_THRESHOLD = args.conf
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")

print("=" * 65)
print("🌾 EcoEcho ESP32-CAM Live Pest Detection Test")
print(f"📡 Target ESP32 Capture URL: {ESP32_CAM_URL}")
print(f"🧠 YOLO Model: {MODEL_PATH}")
print(f"🎯 Confidence Threshold: {CONF_THRESHOLD*100:.0f}%")
print("=" * 65)

print("\nLoading model weights...")
try:
    model = YOLO(MODEL_PATH)
    print(f"✅ Model loaded successfully! Classes: {model.names}\n")
except Exception as e:
    print(f"❌ Failed to load model from {MODEL_PATH}: {e}")
    sys.exit(1)

print("Starting live frame polling... Press 'q' in the video window to quit.\n")

fps_count = 0
fps_timer = time.time()
current_fps = 0

while True:
    try:
        t0 = time.time()
        response = requests.get(ESP32_CAM_URL, timeout=2.5)
        fetch_ms = (time.time() - t0) * 1000

        if response.status_code != 200 or len(response.content) < 100:
            print(f"[{time.strftime('%X')}] ⚠️ ESP32 returned status {response.status_code} ({len(response.content)} bytes)")
            time.sleep(0.5)
            continue

        img_array = np.frombuffer(response.content, dtype=np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if frame is None:
            print(f"[{time.strftime('%X')}] ⚠️ Could not decode JPEG image from ESP32")
            time.sleep(0.5)
            continue

        # Run YOLO inference
        t_infer = time.time()
        results = model.predict(frame, imgsz=640, conf=CONF_THRESHOLD, verbose=False)
        infer_ms = (time.time() - t_infer) * 1000

        annotated = results[0].plot()

        # FPS calculation
        fps_count += 1
        if time.time() - fps_timer >= 1.0:
            current_fps = fps_count
            fps_count = 0
            fps_timer = time.time()

        # Draw HUD overlay
        h, w = annotated.shape[:2]
        cv2.rectangle(annotated, (0, 0), (w, 35), (20, 30, 20), -1)
        hud_text = f"ESP32: {ESP32_CAM_URL} | FPS: {current_fps} | Fetch: {fetch_ms:.0f}ms | Infer: {infer_ms:.0f}ms"
        cv2.putText(annotated, hud_text, (10, 24), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (120, 255, 120), 1)

        # Print detected pests
        boxes = results[0].boxes
        if boxes is not None and len(boxes) > 0:
            detected_names = []
            for box in boxes:
                cls_id = int(box.cls[0].item())
                name = model.names.get(cls_id, f"Class {cls_id}")
                conf = float(box.conf[0].item())
                detected_names.append(f"{name} ({conf*100:.1f}%)")
            print(f"[{time.strftime('%X')}] 🎯 DETECTED {len(boxes)} pest(s): {', '.join(detected_names)}")

        cv2.imshow("EcoEcho ESP32-CAM Pest Detection (best.pt)", annotated)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:
            break

        time.sleep(0.05)

    except requests.exceptions.RequestException as e:
        print(f"[{time.strftime('%X')}] ⏳ ESP32 Connection Waiting ({ESP32_CAM_URL}): {e}")
        time.sleep(1.5)
    except KeyboardInterrupt:
        break

cv2.destroyAllWindows()
print("\n✅ Pest detection test stopped gracefully.")