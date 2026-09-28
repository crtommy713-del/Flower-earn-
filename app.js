import { syncTelegramUser, addFlowersToDatabase } from './db.js';

async function initApp() {
    const balanceEl = document.getElementById('flowerBalance');
    const claimBtn = document.getElementById('claimBtn');

    try {
        const userData = await syncTelegramUser();
        if (balanceEl) {
            balanceEl.innerText = userData && userData.balance !== undefined ? userData.balance : 361;
        }
    } catch (err) {
        console.error("Initialization error:", err);
        if (balanceEl) {
            balanceEl.innerText = "Error: " + err.message;
        }
    }

    if (claimBtn) {
        claimBtn.addEventListener('click', async () => {
            try {
                claimBtn.innerText = "Saving...";
                claimBtn.disabled = true;
                await addFlowersToDatabase(50);
                location.reload();
            } catch (err) {
                alert("Action failed: " + err.message);
                claimBtn.innerText = "Claim Daily +50 Flowers";
                claimBtn.disabled = false;
            }
        });
    }
}

initApp();
