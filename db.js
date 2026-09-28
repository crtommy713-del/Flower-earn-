import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// Your Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9C-bNkvpueC3qK2TxOlPU_goLavCQiBk",
    authDomain: "flower-earn.firebaseapp.com",
    projectId: "flower-earn",
    storageBucket: "flower-earn.firebasestorage.app",
    messagingSenderId: "799031720926",
    appId: "1:799031720926:web:68f997c2d135242f463b4f",
    measurementId: "G-JMLSY039Z2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sync or create user profile in Firestore
export async function syncTelegramUser() {
    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;

    const userId = user ? String(user.id) : "7927840249";
    const username = user ? (user.username || user.first_name) : "DemoUser";

    const userRef = doc(db, "users", userId);
    
    try {
        let docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
            const initialData = {
                telegramId: userId,
                username: username,
                balance: 361,
                createdAt: serverTimestamp()
            };
            await setDoc(userRef, initialData);
            return initialData;
        } else {
            return docSnap.data();
        }
    } catch (error) {
        console.error("Error syncing user data:", error);
        return { balance: 361, username: username, telegramId: userId };
    }
}

// Add flowers to database atomically
export async function addFlowersToDatabase(amount) {
    const tg = window.Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user ? String(tg.initDataUnsafe.user.id) : "7927840249";
    const userRef = doc(db, "users", userId);

    try {
        await runTransaction(db, async (transaction) => {
            const docSnap = await transaction.get(userRef);
            if (!docSnap.exists()) return;
            
            const currentBalance = docSnap.data().balance || 0;
            const newBalance = currentBalance + amount;
            transaction.update(userRef, { balance: newBalance });
        });
    } catch (error) {
        console.error("Failed to update balance in Firestore:", error);
    }
}
