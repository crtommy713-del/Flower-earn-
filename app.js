import { syncTelegramUser, addFlowersToDatabase } from './db.js';

window.addEventListener('DOMContentLoaded', async () => {
    const balanceEl = document.getElementById('flowerBalance');
    const claimBtn = document.getElementById('claimBtn');

    // Load user balance from Firestore on startup
    const userData = await syncTelegramUser();
    if (balanceEl) {
        balanceEl.innerText = userData.balance !== undefined ? userData.balance : 361;
    }

    // Claim reward action
    if (claimBtn) {
        claimBtn.addEventListener('click', async () => {
            claimBtn.innerText = "Saving...";
            claimBtn.disabled = true;

            await addFlowersToDatabase(50);

            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }

            location.reload();
        });
    }
});
