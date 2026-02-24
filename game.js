document.addEventListener("DOMContentLoaded", function () {

let game = {
  username: "",
  yolk: 0,
  totalClicks: 0,
  clickPower: 1,
  autoPower: 0,
  critChance: 0.05,
  prestige: 0
};

// ---------------- START ----------------

window.startGame = function () {
  const input = document.getElementById("usernameInput");
  if (!input.value.trim()) return alert("Enter username");

  game.username = input.value.trim();

  document.getElementById("playerName").innerText = game.username;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

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

// ---------------- UI ----------------

function updateUI() {

  document.getElementById("points").innerText = Math.floor(game.yolk);
  document.getElementById("rankDisplay").innerText = "Prestige " + game.prestige;

  document.getElementById("prestigeBtn").innerText =
    "Prestige (" + (10000 * (game.prestige + 1)) + ")";

  const cps = game.autoPower;
  document.getElementById("cpsDisplay").innerText = "CPS: " + cps;
}

});