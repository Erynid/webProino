// Konfigurasi Firebase project "sahabat-udara-bersih-b3629"
// Diambil dari Firebase Console > Project settings > Your apps > Web app.
//
// PENTING: nilai di bawah ini saya baca dari FOTO layar, jadi bisa ada huruf
// yang salah baca (misalnya I/l atau 0/O). Kalau nanti koneksi gagal, buka
// Firebase Console, klik ikon salin di blok kode firebaseConfig, lalu tempel
// ulang isinya menggantikan objek di bawah.

export const firebaseConfig = {
  apiKey: "AIzaSyBHBGKnYdED6dny4ZrTUP4fbbF4_SIuRko",
  authDomain: "sahabat-udara-bersih-b3629.firebaseapp.com",
  projectId: "sahabat-udara-bersih-b3629",
  storageBucket: "sahabat-udara-bersih-b3629.firebasestorage.app",
  messagingSenderId: "518239132010",
  appId: "1:518239132010:web:4587ae47ebf62ee636ad13",

  // Baris ini TIDAK ada di kode dari console karena Realtime Database belum dibuat.
  // Setelah database dibuat, SALIN alamat aslinya dari tab Data, lalu cocokkan
  // dengan di bawah. Perkiraan kalau lokasinya Singapore:
  databaseURL:
    "https://sahabat-udara-bersih-b3629-default-rtdb.asia-southeast1.firebasedatabase.app",
};
