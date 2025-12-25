import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, onValue, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

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

let currentUID = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUID = user.uid;
        loadBalance(user.uid);
        loadHistory();
    } else {
        window.location.href = "index.html";
    }
});

function loadBalance(uid) {
    onValue(ref(db, `users/${uid}/balance`), (snap) => {
        const bal = snap.val() || 0;
        document.getElementById('balance').innerText = bal.toLocaleString() + " so'm";
    });
}

function loadHistory() {
    const historyList = document.getElementById('historyList');
    
    // Foydalanuvchi yuborgan barcha so'rovlarni (requests) kuzatish
    // Eslatma: Haqiqiy loyihada tasdiqlanganlar alohida 'history' papkasiga ko'chirilishi mumkin
    // Hozircha 'requests' va foydalanuvchining shaxsiy 'transactions' papkasini tekshiramiz
    const reqRef = ref(db, 'requests');
    
    onValue(reqRef, (snapshot) => {
        historyList.innerHTML = "";
        let hasData = false;

        snapshot.forEach((child) => {
            const data = child.val();
            // Faqat joriy foydalanuvchiga tegishli ma'lumotni chiqarish
            if (data.uid === currentUID) {
                hasData = true;
                const html = `
                    <div class="history-item">
                        <div class="history-info">
                            <h4>${data.amount > 0 ? 'To\'ldirish' : 'Yechib olish'}</h4>
                            <span>${data.time}</span>
                        </div>
                        <div class="history-amount">
                            <span class="amount">${data.amount.toLocaleString()} so'm</span>
                            <span class="status ${data.status}">${data.status === 'pending' ? 'Kutilmoqda' : 'Bajarildi'}</span>
                        </div>
                    </div>
                `;
                historyList.insertAdjacentHTML('afterbegin', html);
            }
        });

        if (!hasData) {
            historyList.innerHTML = "<p class='loading'>Hozircha amallar yo'q.</p>";
        }
    });
}

// Filtrlash funksiyasi (ixtiyoriy)
window.filterHistory = (type) => {
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    // Filtrlash mantiqini shu yerda loadHistory() ni kengaytirish orqali qilish mumkin
};
