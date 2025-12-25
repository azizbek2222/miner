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

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('profileEmail').innerText = user.email;
        document.getElementById('profileName').innerText = user.email.split('@')[0];

        const balanceRef = ref(db, 'users/' + user.uid + '/balance');
        onValue(balanceRef, (snapshot) => {
            const data = snapshot.val();
            document.getElementById('profileBalance').innerText = (data || 0).toLocaleString() + " so'm";
        });
    } else {
        window.location.href = "index.html";
    }
});

window.changeTab = (page) => {
    window.location.href = page + ".html";
};

window.logout = async () => {
    if(confirm("Tizimdan chiqmoqchimisiz?")) {
        await signOut(auth);
        window.location.href = "index.html";
    }
};
