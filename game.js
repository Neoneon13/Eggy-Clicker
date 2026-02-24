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
  lastSave: Date.now()
};

// ================= PRESTIGE TIERS =================

function getPrestigeName(level) {

  if (level === 0) return "None";

  const tiers = [
    "Bronze",
    "Silver",
    "Gold",
    "Diamond"
  ];

  // Bronze I & II
  if (level <= 2) return "Bronze " + (level);

  // Silver I & II
  if (level <= 4) return "Silver " + (level - 2);

  // Gold I & II
  if (level <= 6) return "Gold " + (level - 4);

  // Diamond I & II
  if (level <= 8) return "Diamond " + (level - 6);

  // Master I - X
  if (level <= 18) return "Master " + (level - 8);

  // Ultimate Master
  return "Ultimate Master " + (level - 18);
}

// ================= START =================

window.startGame = function () {
  const input = document.getElementById("usernameInput");
  if (!input.value.trim()) return alert("Enter username");

  game.username = input.value.trim();

  document.getElementById("playerName").innerText = game.username;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  loadSave();
  applyOfflineEarnings();
  updateUI();
};

// ================= CLICK =================

const egg = document.getElementById("egg");

egg.addEventListener("click", function (e) {

  let value = game.clickPower;
  let crit = false;

  if (Math.random() < game.critChance) {
    value *= 3;
    crit = true;
  }

  addYolk(value);
  game.totalClicks++;

  showFloatingText("+" + value, e.clientX, e.clientY, crit);

  updateUI();
});

// ================= SAFE ADD =================

function addYolk(amount) {
  if (amount < 0) return;

  const maxGain = game.clickPower * 10 + game.autoPower * 5;

  if (amount > maxGain) return;

  game.yolk += amount;
  game.totalEarned += amount;

  antiCheat();
}

// ================= AUTO =================

setInterval(function () {
  if (game.autoPower > 0) {
    addYolk(game.autoPower);
  }
}, 1000);

// ================= OFFLINE =================

function applyOfflineEarnings() {
  const now = Date.now();
  const diff = Math.floor((now - game.lastSave) / 1000);

  if (diff < 0) {
    game.lastSave = now;
    return;
  }

  const capped = Math.min(diff, 1800);
  const gain = capped * game.autoPower;

  if (gain > 0) {
    game.yolk += gain;
    alert("Offline earnings: " + gain);
  }

  game.lastSave = now;
}

// ================= ANTI CHEAT =================

function antiCheat() {
  if (game.yolk < 0) game.yolk = 0;

  const maxPossible =
    game.totalClicks * (game.clickPower * 5) +
    (game.autoPower * 1800);

  if (game.yolk > maxPossible * 5) {
    game.yolk = Math.floor(maxPossible);
  }
}

// ================= FLOATING =================

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

// ================= SHOP =================

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

// ================= PRESTIGE =================

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

// ================= BACKGROUND =================

window.changeBackground = function () {
  const hue = Math.floor(Math.random() * 360);
  const color = "hsl(" + hue + ", 80%, 95%)";
  document.body.style.background = color;
  game.background = color;
};

// ================= SAVE =================

window.saveGame = function () {
  game.lastSave = Date.now();
  localStorage.setItem("eggySave", JSON.stringify(game));
  alert("Saved!");
};

function loadSave() {
  const data = localStorage.getItem("eggySave");
  if (!data) return;
  game = JSON.parse(data);
  document.body.style.background = game.background;
}

setInterval(function () {
  game.lastSave = Date.now();
  localStorage.setItem("eggySave", JSON.stringify(game));
}, 30000);

// ================= UI =================

function updateUI(){
  document.getElementById("points").innerText = Math.floor(game.yolk);
  document.getElementById("rankDisplay").innerText =
    getPrestigeName(game.prestige);
  document.getElementById("prestigeBtn").innerText =
    "Prestige (" + (10000 * (game.prestige + 1)) + ")";
  document.getElementById("cpsDisplay").innerText =
    "CPS: " + game.autoPower;
}

});