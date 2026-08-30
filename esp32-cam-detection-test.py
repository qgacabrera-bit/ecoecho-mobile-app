"""
EcoEcho ESP32-CAM Pest Detection Test & Live Monitor
===================================================
Uses 'best.pt' YOLO model to detect rice pests from the ESP32-CAM stream.
"""

import cv2
import numpy as np
import requests
from ultralytics import YOLO
import time
import os

ESP32_CAM_URL = os.environ.get("ESP32_CAM_URL", "http://192.168.100.135/capture")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best.pt")

print(f"Loading EcoEcho Pest Detection Model from: {MODEL_PATH}")
model = YOLO(MODEL_PATH)
print(f"Loaded classes: {model.names}")
print(f"Polling ESP32-CAM at: {ESP32_CAM_URL}")
print("Press 'q' in the camera window to exit.\n")

while True:
    try:
        response = requests.get(ESP32_CAM_URL, timeout=5)
        print(f"[{time.strftime('%X')}] Status: {response.status_code} | Bytes: {len(response.content)}")

        img_array = np.frombuffer(response.content, dtype=np.uint8)
        frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if frame is None:
            print("Failed to decode image from ESP32-CAM")
            time.sleep(1)
            continue

        results = model.predict(frame, imgsz=640, conf=0.70, verbose=False)
        annotated = results[0].plot()

        # Print detection summary
        boxes = results[0].boxes
        if boxes is not None and len(boxes) > 0:
            for box in boxes:
                cls_id = int(box.cls[0].item())
                name = model.names.get(cls_id, f"Class {cls_id}")
                conf = float(box.conf[0].item())
                print(f"  -> Detected: {name} ({conf*100:.1f}%)")

        cv2.imshow('EcoEcho ESP32-CAM Pest Detection (best.pt)', annotated)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        time.sleep(0.5)

    except requests.exceptions.RequestException as e:
        print(f"ESP32 Connection error ({ESP32_CAM_URL}): {e}")
        time.sleep(2)
    except KeyboardInterrupt:
        break

cv2.destroyAllWindows()
print("Pest detection stopped.")