import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const app = initializeApp({
  apiKey:"AIzaSyBUkCUhNzMGSBc7q23QVOAh0yK0OOl80uM",
  databaseURL:"https://kazino-b83b8-default-rtdb.firebaseio.com"
});

const auth = getAuth(app);
const db = getDatabase(app);

let balance=0, bet=0, playing=false, mult=1, status="waiting";
let uid=null;

const balanceEl=document.getElementById("user-balance");
const multEl=document.getElementById("multiplier-display");
const betInput=document.getElementById("bet-amount");
const betBtn=document.getElementById("bet-btn");
const cashBtn=document.getElementById("cashout-btn");

onAuthStateChanged(auth,u=>{
  if(!u) location.href="index.html";
  uid=u.uid;

  onValue(ref(db,"users/"+uid+"/balance"),s=>{
    balance=s.val()||0;
    balanceEl.innerText=balance.toLocaleString();
  });
});

onValue(ref(db,"game"),snap=>{
  if(!snap.exists()) return;
  const g=snap.val();

  if(g.ai!==true){
    multEl.innerText="O‘yin to‘xtatilgan";
    betBtn.disabled=true;
    cashBtn.disabled=true;
    return;
  }

  status=g.status;
  mult=g.multiplier||1;

  if(status==="flying"){
    multEl.innerText=mult.toFixed(2)+"x";
    betBtn.disabled=false;
  }

  if(status==="crashed"){
    multEl.innerText="CRASH";
    cashBtn.disabled=true;
    playing=false;
  }
});

betBtn.onclick=async()=>{
  bet=Number(betInput.value);
  if(bet<1000) return alert("Minimal 1000");
  if(bet>balance) return alert("Balans yetarli emas");
  if(status!=="flying") return alert("Raundni kuting");

  await update(ref(db,"users/"+uid),{
    balance:balance-bet
  });

  playing=true;
  betBtn.disabled=true;
  cashBtn.disabled=false;
};

cashBtn.onclick=async()=>{
  if(!playing) return;
  const win=Math.floor(bet*mult);
  await update(ref(db,"users/"+uid),{
    balance:balance+win
  });
  playing=false;
  cashBtn.disabled=true;
};