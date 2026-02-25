// =========================
// EGGY CLICKER CORE ENGINE
// =========================

// ---------- GAME STATE ----------
window.game = {
    yolk: 0,
    clickPower: 1,
    autoClickers: 0,
    critChance: 0,
    prestigeLevel: 0,
    totalClicks: 0,
    cps: 0,
    currentForm: "Normal",
    unlockedForms: ["Normal"]
};

// ---------- ELEMENTS ----------
const yolkDisplay = document.getElementById("points");
const cpsDisplay = document.getElementById("cps");
const egg = document.getElementById("egg");
const rankDisplay = document.getElementById("rankDisplay");

// ---------- UPDATE UI ----------
function updateUI() {
    yolkDisplay.textContent = Math.floor(game.yolk);
    cpsDisplay.textContent = game.cps;
    updateRank();
}

// ---------- CLICK FUNCTION ----------
function clickEgg() {
    let amount = game.clickPower;

    // Critical hit
    if (Math.random() < game.critChance) {
        amount *= 2;
        floatingText("CRIT! +" + amount);
    } else {
        floatingText("+" + amount);
    }

    game.yolk += amount;
    game.totalClicks++;
    updateUI();
}

// ---------- AUTO CLICK ----------
setInterval(() => {
    game.cps = game.autoClickers;
    game.yolk += game.autoClickers;
    updateUI();
}, 1000);

// ---------- RANK SYSTEM ----------
function updateRank() {
    if (game.prestigeLevel >= 10) {
        rankDisplay.textContent = "Rank: Egg God";
    } else if (game.prestigeLevel >= 5) {
        rankDisplay.textContent = "Rank: Golden Egg";
    } else if (game.prestigeLevel >= 1) {
        rankDisplay.textContent = "Rank: Cracked Legend";
    } else {
        rankDisplay.textContent = "Rank: None";
    }
}

// ---------- FLOATING TEXT ----------
function floatingText(text) {
    const el = document.createElement("div");
    el.textContent = text;
    el.style.position = "absolute";
    el.style.left = "50%";
    el.style.top = "45%";
    el.style.transform = "translateX(-50%)";
    el.style.fontWeight = "bold";
    el.style.animation = "floatUp 1s forwards";
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 1000);
}

// ---------- EGG CLICK EVENT ----------
egg.addEventListener("click", clickEgg);

// ---------- INITIAL LOAD ----------
updateUI();