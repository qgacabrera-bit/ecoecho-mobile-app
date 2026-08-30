"""
EcoEcho Local Webcam Pest Detection Test & Live Monitor
======================================================
Uses 'best.pt' YOLO model to detect rice pests in real-time using your local webcam.

Model Classes Detected:
0: Brown Planthopper (Nilaparvata lugens)
1: Green Leafhopper (Nephotettix virescens)
2: Leaf Folder (Cnaphalocrocis medinalis)
3: Rice Bug (Leptocorisa oratorius)
4: Rice Stem Borer (Scirpophaga incertulas)
5: Whorl Maggot (Hydrellia philippina)

Controls:
- Press 'q' or 'ESC' to exit
- Press 's' to save a snapshot
"""

import os
import sys
import time
import cv2
from ultralytics import YOLO

# Configuration
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")
CAMERA_INDEX = int(os.environ.get("WEBCAM_INDEX", 0))
CONFIDENCE_THRESHOLD = 0.70  # 70% Confidence Threshold
IMAGE_SIZE = 640

print("=" * 60)
print("🌾 EcoEcho AI Vision - Local Webcam Rice Pest Detector")
print("=" * 60)
print(f"📦 Loading YOLO weights from: {MODEL_PATH}")

try:
    model = YOLO(MODEL_PATH)
    print(f"✅ Model loaded successfully!")
    print(f"🎯 Target classes: {model.names}")
except Exception as e:
    print(f"❌ Error loading YOLO model: {e}")
    sys.exit(1)

print(f"\n📷 Opening local webcam (Index: {CAMERA_INDEX})...")
cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW if sys.platform.startswith("win") else cv2.CAP_ANY)

if not cap.isOpened():
    print(f"⚠️ Warning: DirectShow failed, trying default backend for camera index {CAMERA_INDEX}...")
    cap = cv2.VideoCapture(CAMERA_INDEX)

if not cap.isOpened():
    print(f"❌ Error: Could not open webcam at index {CAMERA_INDEX}.")
    print("👉 Tips: Check if another application (e.g. Zoom, browser) is using your webcam, or try WEBCAM_INDEX=1.")
    sys.exit(1)

# Set resolution for crisp detection
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

print("✅ Webcam connected!")
print("\n[Controls] Press 'q' to quit | Press 's' to take snapshot\n")

fps_counter = 0
fps_timer = time.time()
current_fps = 0.0

while True:
    ret, frame = cap.read()
    if not ret or frame is None:
        print("⚠️ Failed to grab frame from webcam. Retrying...")
        time.sleep(0.1)
        continue

    # Run YOLO inference
    t0 = time.time()
    results = model.predict(frame, imgsz=IMAGE_SIZE, conf=CONFIDENCE_THRESHOLD, verbose=False)
    infer_ms = (time.time() - t0) * 1000

    # Draw bounding boxes and labels on frame
    annotated = results[0].plot()

    # Calculate FPS
    fps_counter += 1
    if time.time() - fps_timer >= 1.0:
        current_fps = fps_counter / (time.time() - fps_timer)
        fps_counter = 0
        fps_timer = time.time()

    # Draw HUD overlay
    boxes = results[0].boxes
    pest_count = len(boxes) if boxes is not None else 0

    hud_color = (0, 200, 100) if pest_count == 0 else (0, 100, 255)
    cv2.rectangle(annotated, (10, 10), (320, 75), (20, 30, 20), -1)
    cv2.rectangle(annotated, (10, 10), (320, 75), hud_color, 2)
    cv2.putText(annotated, f"EcoEcho AI (best.pt): {current_fps:.1f} FPS", (20, 35),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)
    cv2.putText(annotated, f"Pests Detected: {pest_count} | Infer: {infer_ms:.1f}ms", (20, 60),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, hud_color, 2)

    # Print detections to terminal
    if boxes is not None and len(boxes) > 0:
        for idx, box in enumerate(boxes):
            cls_id = int(box.cls[0].item())
            name = model.names.get(cls_id, f"Class {cls_id}")
            conf = float(box.conf[0].item())
            print(f"[{time.strftime('%X')}] 🚨 Pest #{idx+1}: {name} ({conf*100:.1f}%) | Latency: {infer_ms:.1f}ms")

    cv2.imshow("EcoEcho AI - Local Webcam Pest Detector (best.pt)", annotated)

    key = cv2.waitKey(1) & 0xFF
    if key == ord('q') or key == 27:
        break
    elif key == ord('s'):
        filename = f"pest_snapshot_{int(time.time())}.jpg"
        cv2.imwrite(filename, annotated)
        print(f"📸 Snapshot saved to: {filename}")

cap.release()
cv2.destroyAllWindows()
print("👋 Webcam pest detector stopped cleanly.")
