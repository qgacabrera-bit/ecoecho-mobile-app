# 🌾 EcoEcho: Smart Acoustic Pest Deterrent & Monitoring System

[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8-AI%20Vision-00FFFF?logo=ultralytics&logoColor=black)](https://ultralytics.com/)
[![ESP32-CAM](https://img.shields.io/badge/ESP32--CAM-IoT%20Edge-E7352C?logo=espressif&logoColor=white)](https://www.espressif.com/)

> **"Protecting Rice Crops Through Sound, Not Poison."**  
> EcoEcho is an IoT-enabled, solar-powered acoustic pest deterrent and AI monitoring system engineered to mitigate destructive rice insect infestations without synthetic chemical sprays.

---

## 🌟 Key Features

- **🎯 AI Vision Pest Detection (YOLOv8)**:
  - Real-time optical inference identifying 6 key rice pest species:
    1. *Brown Planthopper* (`Nilaparvata lugens`)
    2. *Green Leafhopper* (`Nephotettix virescens`)
    3. *Rice Stem Borer* (`Scirpophaga incertulas`)
    4. *Rice Leaf Folder* (`Cnaphalocrocis medinalis`)
    5. *Rice Bug / Harang* (`Leptocorisa oratorius`)
    6. *Rice Hispa* (`Dicladispa armigera`)

- **🔊 20.0–45.0 kHz Non-Habituating Ultrasonic Jammer**:
  - Emits dynamic frequency sweeps that disrupt insect tympanal hearing organs and mating communication without chemicals.
  - Certified safe for pollinators (honeybees), farm workers, and aquatic ecosystems.

- **🔋 100% Off-Grid Solar Field Station**:
  - Autonomous 5.0V solar power rail with LiFePO4 battery management for 24/7 continuous operation.

- **📱 Progressive Web App (PWA)**:
  - Mobile-first, responsive dashboard with offline capabilities, live camera feeds, and multi-tier acoustic test tools.

---

## 🏗️ System Architecture

```mermaid
graph TD
    ESP32[ESP32-CAM Field Station] -->|HTTP Capture / Hotspot| AI[Python YOLOv8 AI Server]
    AI -->|Real-Time Detections| WebApp[EcoEcho React PWA]
    WebApp -->|Control Commands & Sweep Config| ESP32
    AudioEngine[Dual Piezo Transducers] <--|20.0-45.0 kHz Acoustic Jamming| ESP32
```

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ecoecho-mobile-app.git
cd ecoecho-mobile-app
```

### 2. Install & Run Frontend
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Run AI Vision Server
```bash
pip install ultralytics opencv-python flask flask-cors numpy requests
python ai_server.py
```

### 4. Deploy ESP32-CAM Firmware
1. Open `esp32_cam_remote_stream.ino` in Arduino IDE.
2. Select **AI Thinker ESP32-CAM** board.
3. Configure your Wi-Fi credentials and flash to device.

---

## 📄 License
This project is developed for Academic & Capstone Research.
