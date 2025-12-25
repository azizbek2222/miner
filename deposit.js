import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let userId = null;
let userEmail = "";

onAuthStateChanged(auth, (user) => {
    if (user) { 
        userId = user.uid; 
        userEmail = user.email; 
    } else {
        window.location.href = "login.html"; // Login sahifangiz nomini tekshiring
    }
});

// NUSXA OLISH FUNKSIYASI
window.copyCard = () => {
    const cardNum = document.getElementById('cardNumber').innerText;
    navigator.clipboard.writeText(cardNum);
    alert("Karta raqami nusxalandi!");
};

// SO'ROV YUBORISH FUNKSIYASI
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('submitBtn');
    if (btn) {
        btn.onclick = async () => {
            const amount = document.getElementById('amount').value;
            if (!amount || amount < 1000) {
                alert("Minimal 1000 so'm kiriting!");
                return;
            }

            if (!userId) {
                alert("Xato: Foydalanuvchi aniqlanmadi!");
                return;
            }

            try {
                const requestRef = ref(db, 'requests');
                const newRequest = push(requestRef);
                await set(newRequest, {
                    uid: userId,
                    email: userEmail,
                    amount: parseInt(amount),
                    status: "pending",
                    time: new Date().toLocaleString()
                });
                alert("So'rov admin panelga yuborildi!");
                window.location.href = "home.html";
            } catch (error) {
                console.error("Firebase xatosi:", error);
                alert("Xatolik: " + error.message);
            }
        };
    }
});
