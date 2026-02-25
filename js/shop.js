// =========================
// SHOP SYSTEM
// =========================

const clickUpgradeBtn = document.getElementById("clickUpgrade");
const autoUpgradeBtn = document.getElementById("autoUpgrade");
const critUpgradeBtn = document.getElementById("critUpgrade");

let clickCost = 10;
let autoCost = 50;
let critCost = 100;

// ---------- UPDATE SHOP TEXT ----------
function updateShopUI() {
    clickUpgradeBtn.textContent =
        "Upgrade Click (+" + game.clickPower + ") - Cost: " + clickCost;

    autoUpgradeBtn.textContent =
        "Auto Clicker (" + game.autoClickers + ") - Cost: " + autoCost;

    critUpgradeBtn.textContent =
        "Crit Chance (" + Math.floor(game.critChance * 100) + "%) - Cost: " + critCost;
}

// ---------- BUY CLICK POWER ----------
clickUpgradeBtn.addEventListener("click", () => {
    if (game.yolk >= clickCost) {
        game.yolk -= clickCost;
        game.clickPower += 1;
        clickCost = Math.floor(clickCost * 1.5);
        updateShopUI();
        updateUI();
    }
});

// ---------- BUY AUTO CLICKER ----------
autoUpgradeBtn.addEventListener("click", () => {
    if (game.yolk >= autoCost) {
        game.yolk -= autoCost;
        game.autoClickers += 1;
        autoCost = Math.floor(autoCost * 1.6);
        updateShopUI();
        updateUI();
    }
});

// ---------- BUY CRIT ----------
critUpgradeBtn.addEventListener("click", () => {
    if (game.yolk >= critCost && game.critChance < 0.5) {
        game.yolk -= critCost;
        game.critChance += 0.02;
        critCost = Math.floor(critCost * 1.8);
        updateShopUI();
        updateUI();
    }
});

// ---------- INIT ----------
updateShopUI();