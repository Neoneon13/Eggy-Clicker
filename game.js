document.addEventListener("DOMContentLoaded", function () {

let game = {
  username: "",
  yolk: 0,
  totalClicks: 0,
  clickPower: 1,
  autoPower: 0,
  critChance: 0.05,
  prestige: 0,
  background: "white"
};

// ---------------- START ----------------

window.startGame = function () {
  const input = document.getElementById("usernameInput");
  if (!input.value.trim()) return alert("Enter username");

  game.username = input.value.trim();

  document.getElementById("playerName").innerText = game.username;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  loadSave(); // load if exists
  updateUI();
};

// ---------------- CLICK ----------------

const egg = document.getElementById("egg");

egg.addEventListener("click", function () {

  let value = game.clickPower;

  if (Math.random() < game.critChance) {
    value *= 3;
  }

  game.yolk += value;
  game.totalClicks++;

  updateUI();
});

// ---------------- AUTO CPS ----------------

setInterval(function () {
  if (game.autoPower > 0) {
    game.yolk += game.autoPower;
    updateUI();
  }
}, 1000);

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

window.exportGame = function () {
  const code = btoa(JSON.stringify(game));
  prompt("Copy this save code:", code);
};

window.importGame = function () {
  const code = prompt("Paste save code:");
  if (!code) return;

  try {
    game = JSON.parse(atob(code));
    localStorage.setItem("eggySave", JSON.stringify(game));
    updateUI();
    alert("Import successful!");
  } catch {
    alert("Invalid save code.");
  }
};

window.deleteSave = function () {
  if (confirm("Delete save permanently?")) {
    localStorage.removeItem("eggySave");
    location.reload();
  }
};

// Auto Save every 30 seconds
setInterval(function () {
  localStorage.setItem("eggySave", JSON.stringify(game));
}, 30000);

// ---------------- UI ----------------

function updateUI() {

  document.getElementById("points").innerText = Math.floor(game.yolk);
  document.getElementById("rankDisplay").innerText = "Prestige " + game.prestige;

  document.getElementById("prestigeBtn").innerText =
    "Prestige (" + (10000 * (game.prestige + 1)) + ")";

  document.getElementById("cpsDisplay").innerText =
    "CPS: " + game.autoPower;
}

});