"""
EcoEcho Remote Access & Ngrok Tunnel Launcher
=============================================
Creates a secure public HTTPS tunnel for:
- AI Inference Server (Port 5000)
- EcoEcho PWA Frontend (Port 5173)

Allows remote ESP32-CAM devices and mobile phones outside your local Wi-Fi
to stream video and run AI pest detection.

Usage:
  python start_tunnel.py
  python start_tunnel.py --port=5000 --token=YOUR_NGROK_AUTHTOKEN
"""

import sys
import os
import time

try:
    from pyngrok import ngrok
except ImportError:
    print("❌ pyngrok is not installed. Installing it now...")
    os.system(f"{sys.executable} -m pip install pyngrok")
    from pyngrok import ngrok

port = 5000
token = os.environ.get("NGROK_AUTHTOKEN")

for arg in sys.argv[1:]:
    if arg.startswith("--port="):
        port = int(arg.split("=", 1)[1])
    elif arg.startswith("--token=") or arg.startswith("--authtoken="):
        token = arg.split("=", 1)[1]

if token:
    ngrok.set_auth_token(token)
    print(f"✅ Configured Ngrok authtoken.")

print("=" * 60)
print(f"🌾 EcoEcho Remote Gateway - Starting Ngrok Tunnel on Port {port}")
print("=" * 60)

try:
    tunnel = ngrok.connect(port, "http")
    public_url = tunnel.public_url

    print(f"\n🚀 PUBLIC TUNNEL IS LIVE!")
    print(f"🔗 Public URL: {public_url}")
    print(f"📡 Forwarding to: http://127.0.0.1:{port}\n")
    print("-" * 60)
    print("📱 FOR REMOTE DASHBOARD / MOBILE ACCESS:")
    print(f"   Enter this URL in EcoEcho Settings -> AI Server URL:")
    print(f"   {public_url}")
    print("\n📷 FOR REMOTE ESP32-CAM IN THE FIELD:")
    print(f"   Configure your ESP32 to POST frames to:")
    print(f"   {public_url}/api/detect")
    print("-" * 60)
    print("\nPress Ctrl+C to stop the tunnel.\n")

    # Keep tunnel alive
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    print("\n🛑 Stopping tunnel...")
    ngrok.kill()
    print("👋 Tunnel closed.")
except Exception as e:
    print(f"\n❌ Error starting Ngrok tunnel: {e}")
    print("\n👉 Tip: If you need a free authtoken, sign up at https://ngrok.com and run:")
    print("   python start_tunnel.py --token=YOUR_AUTHTOKEN\n")
