// --- KONEKSI FIREBASE REALTIME DATABASE ---
const firebaseConfig = {
  databaseURL:
    "https://sahabat-udara-bersih-b3629-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Inisialisasi SDK Firebase
if (typeof firebase !== "undefined") {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const db = firebase.database();
  db.ref("sensor/current").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const co2 = data.co2 !== undefined ? data.co2 : 0;
      const co = data.co !== undefined ? data.co : 0;
      const temp = data.temperature !== undefined ? data.temperature : 0;

      // Update nilai elemen di UI Web secara otomatis dari sensor ESP32
      if (document.getElementById("pm"))
        document.getElementById("pm").textContent = co2;
      if (document.getElementById("co"))
        document.getElementById("co").textContent =
          typeof co === "number" ? co.toFixed(1) : co;
      if (document.getElementById("temp"))
        document.getElementById("temp").textContent =
          (typeof temp === "number" ? temp.toFixed(1) : temp) + "°";

      // Tentukan status visual & gauge otomatis berdasarkan standar CO2 & CO
      if (co2 > 2000 || co > 35) {
        updateUIOnly("bad", co2);
      } else if (co2 > 1000 || co > 9) {
        updateUIOnly("mid", co2);
      } else {
        updateUIOnly("good", co2);
      }
    }
  });
}

// Fungsi memperbarui UI, Maskot, & Gauge TANPA mendimpa angka sensor real-time
function updateUIOnly(k, currentCo2) {
  const d = levels[k];
  const arc = document.getElementById("gaugeArc");
  if (arc) {
    arc.style.stroke = d.color;
    arc.style.strokeDashoffset = d.offset;
  }
  if (document.getElementById("statusCard"))
    document.getElementById("statusCard").style.background = d.color;
  if (document.getElementById("mascot")) {
    document.getElementById("mascot").innerHTML = d.face;
    document.getElementById("mascot").style.color = d.color;
  }
  if (document.getElementById("gaugeNum"))
    document.getElementById("gaugeNum").textContent = currentCo2;
  if (document.getElementById("statusTitle"))
    document.getElementById("statusTitle").textContent = d.title;
  if (document.getElementById("statusMsg"))
    document.getElementById("statusMsg").textContent = d.msg;

  document
    .querySelectorAll(".materi-block")
    .forEach((m) => m.classList.toggle("active", m.id === d.materi));
}

// Navigasi Menu Utama
const buttons = document.querySelectorAll("#nav button");
buttons.forEach((b) => {
  b.addEventListener("click", () => {
    buttons.forEach((x) => x.classList.remove("active"));
    document
      .querySelectorAll("main section")
      .forEach((s) => s.classList.remove("active"));
    b.classList.add("active");
    document.getElementById(b.dataset.p).classList.add("active");
  });
});

// Tab Halaman 1 (Kenali Asap)
function setP1Tab(key) {
  document
    .querySelectorAll("#p1 .story-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.t === key));
  document
    .querySelectorAll("#p1 .p1-panel")
    .forEach((p) => p.classList.toggle("active", p.id === "p1-" + key));
}

let quizScore = 0;
function answerQuiz(btn, choice) {
  const item = btn.closest(".quiz-item");
  if (item.classList.contains("answered")) return;
  const correct = item.dataset.correct;
  item.classList.add("answered");
  btn.classList.add(choice === correct ? "picked-correct" : "picked-wrong");
  if (choice === correct) quizScore++;
  document.getElementById("quizScore").textContent =
    "Skor Kuis: " + quizScore + " / 2";
}

// Simulasi Asal Asap
const stories = {
  hutan: {
    who: "Warga",
    action: "membakar hutan untuk buka lahan",
    target: "sekolah & warga sekitar",
    text: "Api pembakaran menyebar luas dan asapnya membuat siswa sesak napas.",
  },
  sampah: {
    who: "Warga",
    action: "membakar sampah di halaman",
    target: "rumah tetangga",
    text: "Asap plastik beracun masuk lewat jendela tetangga dan bikin batuk.",
  },
  pabrik: {
    who: "Pabrik & kendaraan",
    action: "mengeluarkan asap knalpot",
    target: "orang di jalan",
    text: "Asap kotor setiap hari membuat udara perkotaan tercemar.",
  },
};
function setStory(key) {
  const d = stories[key];
  document
    .querySelectorAll("#p2 .story-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.s === key));
  document.getElementById("storyWho").textContent = d.who;
  document.getElementById("storyAction").textContent = d.action;
  document.getElementById("storyTarget").textContent = d.target;
  document.getElementById("storyText").textContent = d.text;
}
setStory("hutan");

// Efek Sentuh Kesehatan
function reactEffect(card, msg) {
  card.querySelector(".effect-reply").textContent = msg;
}

// Data Maskot & Monitoring Sensor
const FACE = {
  good: '<circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="9" cy="10" r="1.3" fill="#fff"/><circle cx="15" cy="10" r="1.3" fill="#fff"/><path d="M8 14q4 4 8 0" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  mid: '<circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="9" cy="10" r="1.3" fill="#fff"/><circle cx="15" cy="10" r="1.3" fill="#fff"/><path d="M8 15h8" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
  bad: '<circle cx="12" cy="12" r="10" fill="currentColor"/><path d="M4 12c0-3 3-5 8-5s8 2 8 5v3c0 2-2 3-4 3H8c-2 0-4-1-4-3v-3z" fill="#fff" opacity=".9"/><path d="M8.5 9.5l2 2M10.5 9.5l-2 2" stroke="currentColor" stroke-width="1.4"/><path d="M13.5 9.5l2 2M15.5 9.5l-2 2" stroke="currentColor" stroke-width="1.4"/>',
};

const levels = {
  good: {
    color: "#3fc47c",
    num: 42,
    face: FACE.good,
    title: "Udara Baik",
    msg: "Aman untuk main dan belajar di luar kelas!",
    offset: 320,
    materi: "materi-good",
  },
  mid: {
    color: "#ffb703",
    num: 105,
    face: FACE.mid,
    title: "Udara Sedang",
    msg: "Kurangi aktivitas berat di luar, siapkan masker ya.",
    offset: 220,
    materi: "materi-mid",
  },
  bad: {
    color: "#ff5c5c",
    num: 180,
    face: FACE.bad,
    title: "Bahaya! Pakai Masker",
    msg: "Jangan main di luar kelas. Tutup jendela & pakai masker!",
    offset: 80,
    materi: "materi-bad",
  },
};

function setLevel(k) {
  updateUIOnly(k, levels[k].num);
}
setLevel("good");

// --- SCRIPT GAME TANTANGAN ANAK ---
const gameItems = [
  {
    name: "Asap Pabrik Hitam",
    emoji: "🏭",
    type: "bad",
    desc: "Mengandung zat kimia berbahaya!",
  },
  {
    name: "Asap Kendaraan",
    emoji: "🚗💨",
    type: "bad",
    desc: "Membuat sesak napas di jalan.",
  },
  {
    name: "Pohon Hijau Asri",
    emoji: "🌳",
    type: "good",
    desc: "Menghasilkan oksigen segar!",
  },
  {
    name: "Memakai Masker",
    emoji: "😷",
    type: "good",
    desc: "Melindungi paru-paru dari debu.",
  },
  {
    name: "Bakar Sampah Plastik",
    emoji: "🗑️🔥",
    type: "bad",
    desc: "Menghasilkan asap beracun.",
  },
  {
    name: "Bersepeda ke Sekolah",
    emoji: "🚲",
    type: "good",
    desc: "Ramah lingkungan tanpa polusi.",
  },
  {
    name: "Asap Rokok",
    emoji: "🚬",
    type: "bad",
    desc: "Bahaya untuk pernapasan anak.",
  },
  {
    name: "Taman Bunga Kota",
    emoji: "🌷",
    type: "good",
    desc: "Membuat udara bersih dan segar.",
  },
  {
    name: "Kabut Asap Tebal",
    emoji: "🌫️",
    type: "bad",
    desc: "Membuat mata pedih & batuk.",
  },
  {
    name: "Menanam Pohon Baru",
    emoji: "🌱",
    type: "good",
    desc: "Investasi udara bersih masa depan!",
  },
];

let gRound = 0,
  gScore = 0,
  gLives = 3,
  gCorrect = 0,
  gLocked = false,
  activeGameItem = null;

function startMiniGame() {
  document.getElementById("game-start-screen").style.display = "none";
  document.getElementById("game-play-area").style.display = "flex";
  document.getElementById("game-end-screen").style.display = "none";
  gRound = 0;
  gScore = 0;
  gLives = 3;
  gCorrect = 0;
  updateGameHUD();
  nextGameRound();
}

function updateGameHUD() {
  document.getElementById("g-score").textContent = gScore;
  document.getElementById("g-lives").textContent = gLives;
  document.getElementById("g-progress").textContent =
    `${Math.min(gRound + 1, gameItems.length)}/${gameItems.length}`;
}

function nextGameRound() {
  if (gRound >= gameItems.length || gLives <= 0) {
    endMiniGame();
    return;
  }
  gLocked = false;
  activeGameItem = gameItems[gRound];
  document.getElementById("obj-emoji").textContent = activeGameItem.emoji;
  document.getElementById("obj-name").textContent = activeGameItem.name;
  document.getElementById("challenge-banner").textContent =
    activeGameItem.type === "good"
      ? "Apakah ini hal yang Sehat & Baik?"
      : "Apakah ini Polusi yang Berbahaya?";
  updateGameHUD();
}

function checkGameAnswer(choice) {
  if (gLocked) return;
  gLocked = true;
  const isCorrect = choice === activeGameItem.type;
  const fb = document.getElementById("game-feedback");

  if (isCorrect) {
    gScore += 100;
    gCorrect++;
    document.getElementById("fb-icon").textContent = "🎉";
    document.getElementById("fb-text").innerHTML =
      `Benar! <br><span style="font-size:0.8rem; font-weight:normal; color:#475569;">${activeGameItem.desc}</span>`;
  } else {
    gLives--;
    document.getElementById("fb-icon").textContent = "❌";
    document.getElementById("fb-text").innerHTML =
      `Kurang Tepat! <br><span style="font-size:0.8rem; font-weight:normal; color:#475569;">${activeGameItem.desc}</span>`;
  }
  fb.style.display = "block";
  updateGameHUD();

  setTimeout(() => {
    fb.style.display = "none";
    gRound++;
    if (gLives <= 0 || gRound >= gameItems.length) {
      endMiniGame();
    } else {
      nextGameRound();
    }
  }, 2000);
}

function endMiniGame() {
  document.getElementById("game-play-area").style.display = "none";
  document.getElementById("game-end-screen").style.display = "block";
  document.getElementById("final-score").textContent = gScore;
  document.getElementById("final-correct").textContent =
    `${gCorrect} / ${gameItems.length}`;

  const badge = document.getElementById("end-badge");
  const title = document.getElementById("end-title");
  const subtitle = document.getElementById("end-subtitle");

  if (gLives > 0 && gCorrect >= 8) {
    badge.textContent = "🏆";
    title.textContent = "Luar Biasa, Pahlawan Udara!";
    subtitle.textContent = "Skor tertinggi! Siap berhak dapat hadiah!";
  } else if (gLives > 0) {
    badge.textContent = "⭐";
    title.textContent = "Kerja Bagus!";
    subtitle.textContent = "Kamu sudah belajar cara menghindari polusi!";
  } else {
    badge.textContent = "🛡️";
    title.textContent = "Tetap Semangat!";
    subtitle.textContent = "Yuk coba lagi supaya makin jago!";
  }
}