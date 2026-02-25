// =========================
// PRESTIGE SYSTEM
// =========================

const prestigeBtn = document.getElementById("prestigeBtn");

let basePrestigeCost = 5000;

function getPrestigeCost() {
    return basePrestigeCost * (game.prestigeLevel + 1);
}

function updatePrestigeUI() {
    prestigeBtn.textContent =
        "Prestige (Cost: " + getPrestigeCost() + ")";
}

prestigeBtn.addEventListener("click", () => {

    const cost = getPrestigeCost();

    if (game.yolk >= cost) {

        game.prestigeLevel++;

        // Reset core progress
        game.yolk = 0;
        game.clickPower = 1;
        game.autoClickers = 0;
        game.critChance = 0;

        // Prestige bonus scaling
        game.clickPower += game.prestigeLevel;

        // Reset shop costs
        if (typeof clickCost !== "undefined") {
            clickCost = 10;
            autoCost = 50;
            critCost = 100;
        }

        updatePrestigeUI();
        updateUI();
        updateShopUI();
    }
});

// Init
updatePrestigeUI();