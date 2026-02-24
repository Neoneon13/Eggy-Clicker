document.addEventListener("DOMContentLoaded", function () {

let game = {
  username: "",
  yolk: 0,
  totalClicks: 0,
  totalEarned: 0,
  clickPower: 1,
  autoPower: 0,
  critChance: 0.05,
  critStreak: 0,
  maxCritStreak: 0,
  prestige: 0,
  background: "white",
  achievements: [],
  lastSave: Date.now()
};

// ---------------- START ----------------

window.startGame = function () {
  const input = document.getElementById("usernameInput");
  if (!input.value.trim()) return alert("Enter username");

  game.username = input.value.trim();

  document.getElementById("playerName").innerText = game.username;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  loadSave();
  applyOfflineEarnings();
  renderAchievements();
  renderWardrobe();
  updateUI();
};

// ---------------- CLICK ----------------

const egg = document.getElementById("egg");

egg.addEventListener("click", function (e) {

  let value = game.clickPower;
  let crit = false;

  if (Math.random() < game.critChance) {
    value *= 3;
    crit = true;
  }

  game.yolk += value;
  game.totalEarned += value;
  game.totalClicks++;

  if (crit) {
    game.critStreak++;
    if (game.critStreak > game.maxCritStreak)
      game.maxCritStreak = game.critStreak;
  } else {
    game.critStreak = 0;
  }

  showFloatingText("+" + value, e.clientX, e.clientY, crit);

  checkAchievements();
  updateUI();
});

// ---------------- FLOATING TEXT ----------------

function showFloatingText(text, x, y, crit) {
  const div = document.createElement("div");
  div.innerText = text;
  div.style.position = "fixed";
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.fontWeight = "bold";
  div.style.pointerEvents = "none";
  div.style.color = crit ? "red" : "black";
  div.style.transition = "all 1s ease-out";

  document.body.appendChild(div);

  setTimeout(() => {
    div.style.top = (y - 50) + "px";
    div.style.opacity = 0;
  }, 10);

  setTimeout(() => div.remove(), 1000);
}

// ---------------- AUTO CPS ----------------

setInterval(function () {
  if (game.autoPower > 0) {
    const gain = game.autoPower;
    game.yolk += gain;
    game.totalEarned += gain;
    updateUI();
  }
}, 1000);

// ---------------- OFFLINE EARNINGS (30 MIN CAP) ----------------

function applyOfflineEarnings() {
  const now = Date.now();
  const diffSeconds = Math.floor((now - game.lastSave) / 1000);

  const maxSeconds = 1800; // 30 min
  const effectiveSeconds = Math.min(diffSeconds, maxSeconds);

  const earnings = effectiveSeconds * game.autoPower;

  if (earnings > 0) {
    game.yolk += earnings;
    alert("You earned " + earnings + " yolk while offline!");
  }

  game.lastSave = now;
}

// ---------------- SHOP ----------------

window.buyClickUpgrade = function () {
  const cost = 50 * game.clickPower;
  if (game.yolk < cost) return;

  game.yolk -= cost;
  game.clickPower++;
  updateUI();
};

window.buyAutoUpgrade = function () {
  const cost = 100 * (game.autoPower + 1);
  if (game.yolk < cost) return;

  game.yolk -= cost;
  game.autoPower++;
  updateUI();
};

window.buyCritUpgrade = function () {
  const cost = 500;
  if (game.yolk < cost) return;

  game.yolk -= cost;
  game.critChance += 0.01;
  updateUI();
};

// ---------------- PRESTIGE ----------------

window.prestige = function () {
  const cost = 10000 * (game.prestige + 1);

  if (game.yolk < cost) {
    alert("Need " + cost + " Yolk");
    return;
  }

  game.yolk = 0;
  game.clickPower = 1;
  game.autoPower = 0;
  game.critChance = 0.05;
  game.prestige++;

  updateUI();
};

// ---------------- BACKGROUND ----------------

window.changeBackground = function () {
  const hue = Math.floor(Math.random() * 360);
  const color = "hsl(" + hue + ", 80%, 95%)";
  document.body.style.background = color;
  game.background = color;
};

// ---------------- SAVE SYSTEM ----------------

window.saveGame = function () {
  game.lastSave = Date.now();
  localStorage.setItem("eggySave", JSON.stringify(game));
  alert("Game Saved!");
};

function loadSave() {
  const data = localStorage.getItem("eggySave");
  if (!data) return;

  const parsed = JSON.parse(data);
  if (parsed.username === game.username) {
    game = parsed;
    document.body.style.background = game.background;
  }
}

setInterval(function () {
  game.lastSave = Date.now();
  localStorage.setItem("eggySave", JSON.stringify(game));
}, 30000);

// ---------------- UI ----------------

function updateUI(){
  document.getElementById("points").innerText = Math.floor(game.yolk);
  document.getElementById("rankDisplay").innerText = "Prestige " + game.prestige;
  document.getElementById("prestigeBtn").innerText =
    "Prestige (" + (10000 * (game.prestige + 1)) + ")";
  document.getElementById("cpsDisplay").innerText =
    "CPS: " + game.autoPower;
}

});