import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, update, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUkCUhNzMGSBc7q23QVOAh0yK0OOl80uM",
  databaseURL: "https://kazino-b83b8-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let balance = 0;
let currentMultiplier = 1.00;
let betAmount = 0;
let isPlaying = false;
let gameStatus = "waiting";
let crashPoint = 0;

const balanceEl = document.getElementById("user-balance");
const multiplierEl = document.getElementById("multiplier-display");
const betInput = document.getElementById("bet-amount");
const betBtn = document.getElementById("bet-btn");
const cashoutBtn = document.getElementById("cashout-btn");

let currentUserId = null;

onAuthStateChanged(auth, (user) => {
  if (!user) location.href = "index.html";
  currentUserId = user.uid;

  onValue(ref(db, "users/" + currentUserId + "/balance"), (s) => {
    balance = s.val() || 0;
    balanceEl.innerText = balance.toLocaleString();
  });
});

// 🔥 O‘YIN HOLATINI REAL-TIME O‘QISH
onValue(ref(db, "game"), (snap) => {
  if (!snap.exists()) return;
  const g = snap.val();

  gameStatus = g.status;
  crashPoint = g.crashPoint || 0;
  currentMultiplier = g.multiplier || 1.00;

  if (gameStatus === "flying") {
    multiplierEl.innerText = currentMultiplier.toFixed(2) + "x";
    multiplierEl.style.color = "#ffffff";
  }

  if (gameStatus === "crashed") {
    multiplierEl.innerText = "CRASH " + crashPoint.toFixed(2) + "x";
    multiplierEl.style.color = "#ef4444";
    betBtn.disabled = false;
    cashoutBtn.disabled = true;
    betInput.disabled = false;
    isPlaying = false;
  }
});

// 💰 BET
betBtn.onclick = async () => {
  betAmount = Number(betInput.value);
  if (betAmount < 1000) return alert("Minimal 1000");
  if (betAmount > balance) return alert("Balans yetarli emas");
  if (gameStatus !== "flying") return alert("Raund boshlanishini kuting");

  await update(ref(db, "users/" + currentUserId), {
    balance: balance - betAmount,
  });

  isPlaying = true;
  betBtn.disabled = true;
  cashoutBtn.disabled = false;
  betInput.disabled = true;
};

// 💸 CASHOUT
cashoutBtn.onclick = async () => {
  if (!isPlaying) return;

  const win = Math.floor(betAmount * currentMultiplier);
  await update(ref(db, "users/" + currentUserId), {
    balance: balance + win,
  });

  isPlaying = false;
  cashoutBtn.disabled = true;
};

// 🔒 AGAR AI OFF BO‘LSA
onValue(ref(db, "game/aiEnabled"), (s) => {
  if (s.val() !== true) {
    multiplierEl.innerText = "O‘yin to‘xtatilgan";
    multiplierEl.style.color = "#f87171";
    betBtn.disabled = true;
    cashoutBtn.disabled = true;
  }
});