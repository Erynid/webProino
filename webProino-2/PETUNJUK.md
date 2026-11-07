# Sahabat Udara Bersih - Petunjuk Penyambungan

Alur: Sensor MQ-2 -> ESP32 -> Firebase Realtime Database -> halaman web (Monitoring)

## Isi folder
- index (2).html            : website (sudah tersambung ke Firebase, bagian akhir file)
- esp32_sensor_firebase.ino : program alat (Arduino IDE)
- database.rules.json       : aturan database (tempel di Firebase > Realtime Database > Rules > Publish)
- firebase-config.js        : salinan konfigurasi Firebase (cadangan; web memakai konfigurasi di dalam index)
- style.css, script.js      : file lama, tidak dipakai oleh index (2).html

## Langkah
1. Firebase Console > Realtime Database > tab Rules: tempel isi database.rules.json, klik Publish.
   (Aturan test mode berakhir 7 Desember 2026, ganti sebelum tanggal itu.)
2. Buka esp32_sensor_firebase.ino, isi WIFI_SSID dan WIFI_PASSWORD. Alamat database sudah terisi.
3. Upload ke ESP32. Sensor MQ-2 ke pin 34. Serial Monitor 115200 harus menampilkan "HTTP 200".
4. Buka index (2).html. Di tab Data Firebase harus muncul sensor/current, dan halaman Monitoring berubah sesuai kategori.

Tes tanpa alat: di tab Data isi sensor/current: kategori="bahaya", pm25=150 (angka).

## Kategori
aman (<=35) -> hijau | waspada (<=100) -> kuning | bahaya (>100) -> merah
Nilai pm25 hanyalah indeks asap perkiraan dari MQ-2, bukan PM2.5 yang akurat.

## Jika web tidak berubah
Tekan F12 > Console. Jika ada error "API key not valid", salin ulang firebaseConfig dari
Firebase Console > Project settings > Your apps, lalu tempel di blok <script type="module"> di akhir index.
