import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, set, get, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBUkCUhNzMGSBc7q23QVOAh0yK0OOl80uM",
    authDomain: "kazino-b83b8.firebaseapp.com",
    databaseURL: "https://kazino-b83b8-default-rtdb.firebaseio.com",
    projectId: "kazino-b83b8",
    storageBucket: "kazino-b83b8.firebasestorage.app",
    messagingSenderId: "46554087265",
    appId: "1:46554087265:web:240e6e2808b62ded448f20"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let currentBalance = 0;
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        const balanceRef = ref(db, 'users/' + user.uid + '/balance');
        onValue(balanceRef, (snapshot) => {
            currentBalance = snapshot.val() || 0;
            document.getElementById('balance').innerText = currentBalance.toLocaleString() + " so'm";
        });
    } else {
        window.location.href = "index.html";
    }
});

window.buyMiner = async (minerId, price, dailyProfit) => {
    if (!currentUser) return;

    if (currentBalance < price) {
        alert("Mablag' yetarli emas!");
        return;
    }

    const confirmBuy = confirm(`Ushbu minerni ${price} so'mga sotib olasizmi?`);
    if (!confirmBuy) return;

    const userMinerRef = ref(db, `users/${currentUser.uid}/miners/${minerId}`);
    
    try {
        // Balansni ayirish
        await update(ref(db, 'users/' + currentUser.uid), {
            balance: currentBalance - price
        });

        // Minerni saqlash (Sotib olingan vaqt bilan)
        const purchaseDate = Date.now(); // Hozirgi vaqt millisoniyalarda
        await set(userMinerRef, {
            type: minerId,
            dailyProfit: dailyProfit,
            purchasedAt: purchaseDate,
            lastCollected: purchaseDate // Birinchi daromad 24 soatdan keyin boshlanadi
        });

        alert("Tabriklaymiz! Miner sotib olindi.");
    } catch (error) {
        console.error(error);
        alert("Xatolik yuz berdi.");
    }
};

window.changeTab = (page) => {
    window.location.href = page + ".html";
};
