#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ====== KONFIGURASI WIFI & FIREBASE ======
// ====== SESUAIKAN WIFI DI SINI ======
const char* WIFI_SSID     = "Redmi 10C";
const char* WIFI_PASSWORD = "yoyoyo13";

const char* FIREBASE_HOST = "https://sahabat-udara-bersih-b3629-default-rtdb.asia-southeast1.firebasedatabase.app";
const char* FIREBASE_AUTH = ""; // Kosongkan jika Database Rules public
// =========================================

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

#define MQ135_PIN 34
const float RL = 10.0;
const float VC = 5.0;
const float DIVIDER = 3.0;
const float R0 = 29.825;

const unsigned long INTERVAL_MS = 3000;
unsigned long lastSend = 0;

float getAveragedMilliVolts(int pin) {
  long sum = 0;
  for (int i = 0; i < 50; i++) {
    sum += analogReadMilliVolts(pin);
    delayMicroseconds(100);
  }
  return sum / 50.0;
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  analogSetPinAttenuation(MQ135_PIN, ADC_11db);
  dht.begin();
  connectWiFi();
}

void loop() {
  if (millis() - lastSend > INTERVAL_MS) {
    lastSend = millis();

    float temp = dht.readTemperature();
    float hum = dht.readHumidity();

    float adcMilliVolts = getAveragedMilliVolts(MQ135_PIN);
    float vAO = (adcMilliVolts / 1000.0) * DIVIDER;

    float ppmCO2 = 0.0;
    float ppmCO  = 0.0;

    if (vAO > 0.05 && vAO < VC) {
      float Rs = RL * (VC - vAO) / vAO;
      float ratio = Rs / R0;
      ppmCO2 = 15655.0 * pow(ratio, -2.862);
      ppmCO  = 605.18 * pow(ratio, -3.937);
    }

    if (isnan(temp)) temp = 0.0;
    if (isnan(hum)) hum = 0.0;

    String payload = "{";
    payload += "\"co2\":" + String((int)ppmCO2) + ",";
    payload += "\"co\":" + String(ppmCO, 1) + ",";
    payload += "\"temperature\":" + String(temp, 1) + ",";
    payload += "\"humidity\":" + String(hum, 1);
    payload += "}";

    Serial.println("Payload: " + payload);
    putJson(String(FIREBASE_HOST) + "/sensor/current.json" + authQuery(), payload);
  }
}

void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;
  Serial.print("Menghubungkan ke WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(400);
    Serial.print(".");
  }
  Serial.println("\nWiFi Tersambung! IP: " + WiFi.localIP().toString());
}

String authQuery() {
  if (strlen(FIREBASE_AUTH) == 0) return "";
  return String("?auth=") + FIREBASE_AUTH;
}

void putJson(String url, String payload) {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();
  HTTPClient http;
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int code = http.PUT(payload);
  Serial.printf("PUT sensor/current -> HTTP %d\n", code);
  http.end();
}