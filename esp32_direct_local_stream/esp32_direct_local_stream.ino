/*
 * EcoEcho ESP32-CAM Direct Local Field Streamer (100% Offline / Local Network)
 * ============================================================================
 * Designed for direct local connection between farmer's phone/computer and ESP32.
 * 
 * Select your Wi-Fi Mode below:
 * 1. ACCESS POINT (AP) MODE (Default for Rice Field without router):
 *    - ESP32 broadcasts its own Wi-Fi: "EcoEcho-Field-AP" (Password: "ecoecho123")
 *    - Static IP: 192.168.4.1
 * 
 * 2. STATION (STA) MODE (Connects to farm/home Wi-Fi or Mobile Hotspot):
 *    - Set USE_ACCESS_POINT_MODE = false and enter your Wi-Fi SSID & Password below.
 */

#include "esp_camera.h"
#include <WiFi.h>
#include "esp_http_server.h"

// =================== Wi-Fi Configuration ===================
// Set to true to create a standalone Hotspot ("EcoEcho-Field-AP") with IP 192.168.4.1
// Set to false to connect to your home Wi-Fi or mobile phone hotspot
const bool USE_ACCESS_POINT_MODE = false; 

// If USE_ACCESS_POINT_MODE is true (AP Mode):
const char* ap_ssid = "EcoEcho-Field-AP";
const char* ap_password = "ecoecho123";

// If USE_ACCESS_POINT_MODE is false (Connecting to your Wi-Fi / Hotspot):
const char* ssid = "GlobeAtHome_d64b8";
const char* password = "zw5QXxYK";

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

#define PART_BOUNDARY "123456789000000000000987654321"
static const char* _STREAM_CONTENT_TYPE = "multipart/x-mixed-replace;boundary=" PART_BOUNDARY;
static const char* _STREAM_BOUNDARY = "\r\n--" PART_BOUNDARY "\r\n";
static const char* _STREAM_PART = "Content-Type: image/jpeg\r\nContent-Length: %u\r\n\r\n";

httpd_handle_t stream_httpd = NULL;
httpd_handle_t camera_httpd = NULL;

String currentMode = "AUTOMATIC";
bool isJammingActive = false;

// Single Frame Capture Handler
static esp_err_t capture_handler(httpd_req_t *req) {
  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    httpd_resp_send_500(req);
    return ESP_FAIL;
  }
  httpd_resp_set_type(req, "image/jpeg");
  httpd_resp_set_hdr(req, "Content-Disposition", "inline; filename=capture.jpg");
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");
  esp_err_t res = httpd_resp_send(req, (const char *)fb->buf, fb->len);
  esp_camera_fb_return(fb);
  return res;
}

// Live MJPEG Stream Handler
static esp_err_t stream_handler(httpd_req_t *req) {
  camera_fb_t * fb = NULL;
  esp_err_t res = ESP_OK;
  size_t _jpg_buf_len = 0;
  uint8_t * _jpg_buf = NULL;
  char * part_buf[64];

  httpd_resp_set_type(req, _STREAM_CONTENT_TYPE);
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");

  while (true) {
    fb = esp_camera_fb_get();
    if (!fb) {
      res = ESP_FAIL;
    } else {
      _jpg_buf_len = fb->len;
      _jpg_buf = fb->buf;
    }
    if (res == ESP_OK) {
      size_t hlen = snprintf((char *)part_buf, 64, _STREAM_PART, _jpg_buf_len);
      res = httpd_resp_send_chunk(req, (const char *)part_buf, hlen);
    }
    if (res == ESP_OK) {
      res = httpd_resp_send_chunk(req, (const char *)_jpg_buf, _jpg_buf_len);
    }
    if (res == ESP_OK) {
      res = httpd_resp_send_chunk(req, _STREAM_BOUNDARY, strlen(_STREAM_BOUNDARY));
    }
    if (fb) {
      esp_camera_fb_return(fb);
      fb = NULL;
      _jpg_buf = NULL;
    }
    if (res != ESP_OK) {
      break;
    }
  }
  return res;
}

// Telemetry & Status Handler
static esp_err_t status_handler(httpd_req_t *req) {
  httpd_resp_set_type(req, "application/json");
  httpd_resp_set_hdr(req, "Access-Control-Allow-Origin", "*");

  int rssi = WiFi.RSSI();
  uint32_t freeHeap = ESP.getFreeHeap() / 1024;
  uint32_t uptime = millis() / 1000;

  String json = "{";
  json += "\"status\":\"ONLINE\",";
  json += "\"uptimeSeconds\":" + String(uptime) + ",";
  json += "\"freeHeap\":" + String(freeHeap) + ",";
  json += "\"wifiRssi\":" + String(rssi) + ",";
  json += "\"activeMode\":\"" + currentMode + "\",";
  json += "\"batteryPercent\":92,";
  json += "\"batteryVoltage\":4.18,";
  json += "\"solarVoltage\":5.04,";
  json += "\"solarCurrentMa\":380,";
  json += "\"isCharging\":true,";
  json += "\"frequencyKhz\":36.5,";
  json += "\"isSweepActive\":true,";
  json += "\"isJamming\":" + String(isJammingActive ? "true" : "false") + ",";
  json += "\"firmwareVersion\":\"v2.5.0-LocalPro\"";
  json += "}";

  return httpd_resp_send(req, json.c_str(), json.length());
}

void startCameraServer() {
  httpd_config_t config = HTTPD_DEFAULT_CONFIG();
  config.server_port = 80;
  config.lru_purge_enable = true;

  httpd_uri_t capture_uri = {
    .uri       = "/capture",
    .method    = HTTP_GET,
    .handler   = capture_handler,
    .user_ctx  = NULL
  };

  httpd_uri_t stream_uri = {
    .uri       = "/stream",
    .method    = HTTP_GET,
    .handler   = stream_handler,
    .user_ctx  = NULL
  };

  httpd_uri_t status_uri = {
    .uri       = "/api/status",
    .method    = HTTP_GET,
    .handler   = status_handler,
    .user_ctx  = NULL
  };

  if (httpd_start(&camera_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(camera_httpd, &capture_uri);
    httpd_register_uri_handler(camera_httpd, &stream_uri);
    httpd_register_uri_handler(camera_httpd, &status_uri);
  }

  config.server_port = 81;
  config.ctrl_port = 32769;
  config.lru_purge_enable = true;
  if (httpd_start(&stream_httpd, &config) == ESP_OK) {
    httpd_register_uri_handler(stream_httpd, &stream_uri);
  }
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n🌾 EcoEcho Local Field Station Initializing...");

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

  if (psramFound()) {
    config.frame_size = FRAMESIZE_VGA; // 640x480 (Optimal for YOLO best.pt)
    config.jpeg_quality = 12;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_QVGA; // 320x240
    config.jpeg_quality = 15;
    config.fb_count = 1;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("❌ Camera init failed: 0x%x\n", err);
    return;
  }

  if (USE_ACCESS_POINT_MODE) {
    WiFi.softAP(ap_ssid, ap_password);
    Serial.println("\n📡 ESP32 Access Point Started!");
    Serial.println("   SSID:     " + String(ap_ssid));
    Serial.println("   Password: " + String(ap_password));
    Serial.println("   IP:       http://" + WiFi.softAPIP().toString());
  } else {
    WiFi.begin(ssid, password);
    Serial.print("Connecting to Wi-Fi");
    int retry = 0;
    while (WiFi.status() != WL_CONNECTED && retry < 30) {
      delay(500);
      Serial.print(".");
      retry++;
    }
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("\n✅ Wi-Fi Connected!");
      Serial.println("   IP: http://" + WiFi.localIP().toString());
    } else {
      Serial.println("\n⚠️ Wi-Fi connect timed out. Falling back to AP mode...");
      WiFi.softAP(ap_ssid, ap_password);
      Serial.println("   AP IP: http://" + WiFi.softAPIP().toString());
    }
  }

  startCameraServer();
  String baseIp = USE_ACCESS_POINT_MODE ? WiFi.softAPIP().toString() : WiFi.localIP().toString();
  Serial.println("\n🎥 Camera Capture Endpoint:");
  Serial.println("   http://" + baseIp + "/capture");
  Serial.println("🎥 Live MJPEG Video Stream:");
  Serial.println("   http://" + baseIp + ":81/stream");
  Serial.println("==================================================\n");
}

void loop() {
  delay(10000);
}
