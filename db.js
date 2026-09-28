import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, runTransaction, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

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

export async function syncTelegramUser() {
    try {
        let userId = "7927840249";
        let username = "DemoUser";

        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            userId = String(tgUser.id);
            username = tgUser.username || tgUser.first_name || "TelegramUser";
        }

        const userRef = doc(db, "users", userId);
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
        return { balance: 361 };
    }
}

export async function addFlowersToDatabase(amount) {
    try {
        let userId = "7927840249";
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            userId = String(window.Telegram.WebApp.initDataUnsafe.user.id);
        }
        const userRef = doc(db, "users", userId);

        await runTransaction(db, async (transaction) => {
            const docSnap = await transaction.get(userRef);
            let currentBalance = 361;
            if (docSnap.exists() && docSnap.data().balance !== undefined) {
                currentBalance = docSnap.data().balance;
            }
            transaction.set(userRef, { balance: currentBalance + amount }, { merge: true });
        });
    } catch (error) {
        console.error("Failed to update balance:", error);
    }
}
