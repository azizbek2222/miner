import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

// Ro'yxatdan o'tish
window.register = async () => {
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPassword').value;

    if(email === "" || pass === "") {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Realtime Databaseda yangi foydalanuvchi uchun balans yaratish
        await set(ref(db, 'users/' + user.uid), {
            email: email,
            balance: 0,
            createdAt: new Date().toISOString()
        });

        alert("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
        window.location.href = "home.html";
    } catch (error) {
        alert("Xatolik: " + error.message);
    }
}

// Kirish
window.login = async () => {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, pass);
        window.location.href = "home.html";
    } catch (error) {
        alert("Xatolik: " + error.message);
    }
}

// Formani almashtirish (UI mantiqi)
window.toggleForm = () => {
    const login = document.getElementById('loginForm');
    const reg = document.getElementById('registerForm');
    if (login.style.display === 'none') {
        login.style.display = 'block';
        reg.style.display = 'none';
    } else {
        login.style.display = 'none';
        reg.style.display = 'block';
    }
}
