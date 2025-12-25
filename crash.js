import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const app = initializeApp({
  apiKey:"AIzaSyBUkCUhNzMGSBc7q23QVOAh0yK0OOl80uM",
  databaseURL:"https://kazino-b83b8-default-rtdb.firebaseio.com"
});

const auth = getAuth(app);
const db = getDatabase(app);

let balance = 0;
let betAmount = 0;
let isPlaying = false;
let gameStatus = "waiting";
let multiplier = 1;

const balanceEl = document.getElementById("user-balance");
const multiplierEl = document.getElementById("multiplier-display");
const betInput = document.getElementById("bet-amount");
const betBtn = document.getElementById("bet-btn");
const cashoutBtn = document.getElementById("cashout-btn");

let uid = null;

onAuthStateChanged(auth,(user)=>{
  if(!user) location.href="index.html";
  uid=user.uid;

  onValue(ref(db,"users/"+uid+"/balance"),s=>{
    balance=s.val()||0;
    balanceEl.innerText=balance.toLocaleString();
  });
});

// 🔥 REAL-TIME GAME
onValue(ref(db,"game"),snap=>{
  if(!snap.exists()) return;
  const g=snap.val();

  gameStatus=g.status;
  multiplier=g.multiplier||1;

  if(g.aiEnabled!==true){
    multiplierEl.innerText="O‘yin to‘xtagan";
    betBtn.disabled=true;
    cashoutBtn.disabled=true;
    return;
  }

  if(gameStatus==="flying"){
    multiplierEl.innerText=multiplier.toFixed(2)+"x";
    multiplierEl.style.color="#ffffff";
    betBtn.disabled=false;
  }

  if(gameStatus==="crashed"){
    multiplierEl.innerText="CRASH";
    multiplierEl.style.color="#ef4444";
    cashoutBtn.disabled=true;
    isPlaying=false;
  }
});

// 💰 BET
betBtn.onclick=async()=>{
  betAmount=Number(betInput.value);
  if(betAmount<1000) return alert("Minimal 1000");
  if(betAmount>balance) return alert("Balans yetarli emas");
  if(gameStatus!=="flying") return alert("Raund kuting");

  await update(ref(db,"users/"+uid),{
    balance:balance-betAmount
  });

  isPlaying=true;
  betBtn.disabled=true;
  cashoutBtn.disabled=false;
};

// 💸 CASHOUT
cashoutBtn.onclick=async()=>{
  if(!isPlaying) return;

  const win=Math.floor(betAmount*multiplier);
  await update(ref(db,"users/"+uid),{
    balance:balance+win
  });

  isPlaying=false;
  cashoutBtn.disabled=true;
};