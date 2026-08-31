/*
 * EcoEcho ESP32-CAM Remote Field Streamer (Ngrok / Cloud Compatible)
 * ===================================================================
 * Connects to ANY Wi-Fi or Mobile Hotspot in the field, captures frames,
 * and POSTs them to your public Ngrok tunnel URL for YOLO pest detection.
 * 
 * Works with AI Model: best.pt (Rice Pest Detector)
 */

#include "esp_camera.h"
#include <WiFi.h>
#include <HTTPClient.h>

// =================== Wi-Fi & Ngrok Configuration ===================
const char* ssid = "YOUR_WIFI_OR_HOTSPOT_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// Permanent Render AI Server URL:
const char* serverUrl = "https://ecoecho-backend-1a6d.onrender.com/api/detect";

// Capture interval in milliseconds (e.g., 500ms = 2 FPS)
const unsigned long captureIntervalMs = 500;
unsigned long lastCaptureTime = 0;

// =================== AI-Thinker Camera Pins ===================
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

void setup() {
  Serial.begin(115200);
  Serial.println("\n🌾 EcoEcho ESP32-CAM Remote Field Station Initializing...");

  // Camera config
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.pixel_format = PIXFORMAT_JPEG;

  if(psramFound()){
    config.frame_size = FRAMESIZE_VGA; // 640x480 for best.pt
    config.jpeg_quality = 12;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_QVGA;
    config.jpeg_quality = 15;
    config.fb_count = 1;
  }

  // Camera init
  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("❌ Camera init failed with error 0x%x\n", err);
    return;
  }
  Serial.println("✅ Camera initialized successfully!");

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Wi-Fi connected! IP: " + WiFi.localIP().toString());
  Serial.println("🚀 Ready to stream frames to: " + String(serverUrl));
}

void loop() {
  if (WiFi.status() == WL_CONNECTED && millis() - lastCaptureTime >= captureIntervalMs) {
    lastCaptureTime = millis();

    camera_fb_t * fb = esp_camera_fb_get();
    if (!fb) {
      Serial.println("⚠️ Camera frame capture failed");
      return;
    }

    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "image/jpeg");
    http.addHeader("Bypass-Tunnel-Reminder", "true");      // Skips localtunnel interstitial page
    http.addHeader("ngrok-skip-browser-warning", "true");  // Skips ngrok interstitial page

    int httpResponseCode = http.POST(fb->buf, fb->len);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.printf("[%lu] HTTP %d | Length: %u bytes\n", millis(), httpResponseCode, fb->len);
      // Optional: Check if response contains 'Acoustic Jamming Active' and trigger local buzzer
    } else {
      Serial.printf("❌ HTTP Error: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
    esp_camera_fb_return(fb);
  }
}
