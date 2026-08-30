Act as an expert frontend developer and UI/UX designer. Build a Progressive Web App (PWA) for an agricultural technology project called "EcoEcho". This app serves as the mobile-friendly control dashboard for farmers and agricultural technicians to monitor their fields, manage the EcoEcho acoustic deterrent device, and track pest activity.

### Tech Stack & Configuration
- Framework: React (with Vite or Next.js) and Tailwind CSS for styling.
- PWA Setup: Include the necessary configurations (manifest.json, service worker) so the app is installable on mobile devices (Add to Home Screen) and has offline fallback capabilities. 
- Icons & UI: Use Lucide React for icons. Ensure the layout is mobile-first but fully responsive for desktop (bottom navigation bar on mobile, sidebar on desktop).

### Color Palette & Theme
- Primary: Deep Forest Green (#1B4332) and Leaf Green (#2D6A4F)
- Accent: Bright Solar Yellow (for battery/power indicators)
- Background: Clean off-white/light gray for readability.
- The design should feel modern, agricultural, sustainable, and highly legible outdoors in bright sunlight.

### Core Features & Pages

1. Dashboard (Main Control Center)
- Device Status Header: Show ESP32 connection status (Online/Offline), Solar Power/Battery level (5V indicator), and Uptime.
- Live Camera Feed Component: Create a container for the ESP32 camera stream. Use an `<img>` tag setup to accept an MJPEG stream (e.g., `src="http://[ESP32_IP]/stream"`), but fill it with a placeholder for now. 
- AI Detection Overlay: Build a transparent UI layer over the camera feed that can draw bounding boxes for pest detection (specifically Brown Planthoppers). Add a live "Detection Log" below the camera showing recent AI identifications with timestamps.
- Mode Switcher: A prominent, easy-to-tap toggle switch for the device's operating mode. It must switch between:
  - "Automatic Mode" (Standard frequency sweep technology).
  - "Dynamic Mode" (AI-triggered acoustic jamming based on real-time camera detection).

2. Analytics / Insights Page
- Display mock charts (using Recharts or similar) showing "Pest Detections over the last 7 days" and "Spray Events Reduced (Target: 0%)".

3. About Page
- A beautifully formatted informational page explaining the EcoEcho technology.
- Key sections: "How Frequency Sweep Technology Works" (30-45 kHz acoustic jamming), "Safe for the Ecosystem" (0% chemicals, 0% toxins), and "Solar Powered".

4. Contact & Support Page
- A form for users to request maintenance, report bugs, or contact the local LGU/Co-op support team.
- Include dummy contact details (Email, Phone, LGU Support Hotline).

5. Settings 
- Input fields to configure the ESP32 Camera IP Address and WebSocket URL (so the user can easily connect the app to their local device hardware).
- A button to manually trigger the "Frequency Sweep Test".

### Component Requirements
- Write clean, modular, and well-commented code.
- Create an API utility file (`api.ts` or similar) with mock functions for `fetchCameraStream()`, `toggleDeviceMode()`, and `getAIDetections()`. Add comments explaining exactly where we should plug in our real ESP32 REST/WebSocket endpoints and our AI model inference API later.
- Ensure the app feels snappy and native when installed as a PWA.