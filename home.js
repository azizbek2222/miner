import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// Foydalanuvchi holatini va balansini kuzatish
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Foydalanuvchi nomi
        document.getElementById('userName').innerText = user.email.split('@')[0];

        // Realtime Database orqali balansni kuzatish
        const balanceRef = ref(db, 'users/' + user.uid + '/balance');
        onValue(balanceRef, (snapshot) => {
            const data = snapshot.val();
            // Agar balans bazada bo'lmasa 0 deb ko'rsatiladi
            const currentBalance = data !== null ? data : 0;
            document.getElementById('balance').innerText = currentBalance.toLocaleString() + " so'm";
        });
    } else {
        // Agar kirmagan bo'lsa login sahifasiga qaytarish
        window.location.href = "index.html";
    }
});

// Sahifalararo navigatsiya
window.changeTab = (page) => {
    if (page === 'home') window.location.href = "home.html";
    else if (page === 'shop') window.location.href = "shop.html";
    else if (page === 'games') window.location.href = "games.html";
    else if (page === 'profile') window.location.href = "profile.html";
};

// Tizimdan chiqish
window.logout = async () => {
    try {
        await signOut(auth);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Chiqishda xatolik:", error);
    }
};
