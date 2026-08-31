/*
 * EcoEcho ESP32-CAM Cloud MQTT Streamer
 * =========================================================================
 * Connects your ESP32-CAM to the EcoEcho Web App from ANYWHERE via Cloud MQTT!
 * 
 * Works with the public HiveMQ / EMQX broker:
 * - Broker: broker.hivemq.com (Port: 1883)
 * - Web App connects via: wss://broker.hivemq.com:8884/mqtt
 * 
 * Required Arduino Libraries:
 * 1. PubSubClient (by Nick O'Leary) - Install via Arduino Library Manager
 * 2. ArduinoJson (by Benoît Blanchon) - Install via Arduino Library Manager
 */

#include "esp_camera.h"
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// =================== Wi-Fi & Device Configuration ===================
const char* ssid = "YOUR_WIFI_OR_HOTSPOT_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// Unique Device ID (Match this in the EcoEcho Web App Settings)
const char* DEVICE_ID = "ECOECHO-01";

// Cloud MQTT Broker (HiveMQ Public Free Broker)
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;

// Topics
char topic_camera[64];
char topic_status[64];
char topic_command[64];

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// Timing intervals
unsigned long lastStatusTime = 0;
unsigned long lastFrameTime = 0;
const unsigned long frameIntervalMs = 1000; // 1 FPS for MQTT

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

// Fast Base64 Encoding Table
static const char b64_table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

String base64_encode(const uint8_t *data, size_t input_length) {
  String encoded_data = "";
  encoded_data.reserve(((input_length + 2) / 3) * 4);

  for (size_t i = 0; i < input_length; i += 3) {
    uint32_t octet_a = i < input_length ? data[i] : 0;
    uint32_t octet_b = (i + 1) < input_length ? data[i + 1] : 0;
    uint32_t octet_c = (i + 2) < input_length ? data[i + 2] : 0;
    uint32_t triple = (octet_a << 16) + (octet_b << 8) + octet_c;

    encoded_data += b64_table[(triple >> 18) & 0x3F];
    encoded_data += b64_table[(triple >> 12) & 0x3F];
    encoded_data += (i + 1) < input_length ? b64_table[(triple >> 6) & 0x3F] : '=';
    encoded_data += (i + 2) < input_length ? b64_table[triple & 0x3F] : '=';
  }
  return encoded_data;
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String msg = "";
  for (unsigned int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }
  Serial.printf("📩 MQTT Command received on [%s]: %s\n", topic, msg.c_str());

  if (msg == "TEST_SWEEP") {
    Serial.println("🔊 Triggering 4s Acoustic Sweep Test!");
  } else if (msg == "MODE_DYNAMIC") {
    Serial.println("🎯 Switched to Dynamic AI Jamming Mode");
  } else if (msg == "MODE_AUTO") {
    Serial.println("🛡️ Switched to Automatic Sweep Mode");
  }
}

void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Connecting to Cloud MQTT Broker...");
    String clientId = "ESP32_EcoEcho_" + String(random(0xffff), HEX);
    
    if (mqttClient.connect(clientId.c_str())) {
      Serial.println(" Connected! 🟢");
      mqttClient.subscribe(topic_command);
      Serial.printf("Subscribed to command topic: %s\n", topic_command);
    } else {
      Serial.printf(" Failed, rc=%d. Retrying in 4 seconds...\n", mqttClient.state());
      delay(4000);
    }
  }
}

void publishStatus() {
  StaticJsonDocument<200> doc;
  doc["device"] = DEVICE_ID;
  doc["battery"] = 92;
  doc["solar"] = 5.02;
  doc["freq"] = 38.5;
  doc["status"] = "ONLINE";

  char jsonBuffer[256];
  serializeJson(doc, jsonBuffer);
  mqttClient.publish(topic_status, jsonBuffer);
  Serial.println("📡 Published Telemetry Status to Cloud");
}

void publishCameraFrame() {
  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    Serial.println("❌ Camera capture failed");
    return;
  }

  // Base64 encode the JPEG frame
  String b64 = base64_encode(fb->buf, fb->len);
  esp_camera_fb_return(fb);

  // Publish payload to cloud
  mqttClient.publish(topic_camera, b64.c_str());
  Serial.printf("📸 Published Camera Frame (%d bytes b64) to %s\n", b64.length(), topic_camera);
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n🌾 EcoEcho Cloud MQTT Field Station Starting...");

  // Generate topics
  snprintf(topic_camera, sizeof(topic_camera), "ecoecho/%s/camera", DEVICE_ID);
  snprintf(topic_status, sizeof(topic_status), "ecoecho/%s/status", DEVICE_ID);
  snprintf(topic_command, sizeof(topic_command), "ecoecho/%s/command", DEVICE_ID);

  // Configure Camera
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
    config.frame_size = FRAMESIZE_QVGA; // 320x240 optimized for lightweight MQTT
    config.jpeg_quality = 18;
    config.fb_count = 2;
  } else {
    config.frame_size = FRAMESIZE_QQVGA; // 160x120
    config.jpeg_quality = 22;
    config.fb_count = 1;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("❌ Camera init failed: 0x%x\n", err);
    return;
  }
  Serial.println("✅ Camera initialized!");

  // Connect Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Wi-Fi connected! IP: " + WiFi.localIP().toString());

  // Configure MQTT
  mqttClient.setServer(mqtt_server, mqtt_port);
  mqttClient.setCallback(mqttCallback);
  // Increase buffer size to handle base64 images (default is 256 bytes)
  mqttClient.setBufferSize(40960);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnectMQTT();
  }
  mqttClient.loop();

  // Publish telemetry every 5 seconds
  if (millis() - lastStatusTime > 5000) {
    publishStatus();
    lastStatusTime = millis();
  }

  // Publish camera frame every frameIntervalMs (e.g. 1000ms)
  if (millis() - lastFrameTime > frameIntervalMs) {
    publishCameraFrame();
    lastFrameTime = millis();
  }
}
