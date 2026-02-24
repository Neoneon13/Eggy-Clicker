// ==============================
// 🥚 EGGY CLICKER CLEAN ENGINE
// ==============================

document.addEventListener("DOMContentLoaded", function () {

let game = {
  username: "",
  yolk: 0,
  clickPower: 1,
  prestige: 0
};

// ---------- START GAME ----------
window.startGame = function () {
  const input = document.getElementById("usernameInput");
  if (!input.value.trim()) {
    alert("Enter username");
    return;
  }

  game.username = input.value.trim();

  document.getElementById("playerName").innerText = game.username;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  updateUI();
};

// ---------- CLICK ----------
const egg = document.getElementById("egg");

egg.addEventListener("click", function () {
  game.yolk += game.clickPower;
  updateUI();
});

// ---------- PRESTIGE ----------
window.prestige = function () {
  if (game.yolk < 10000) {
    alert("Need 10000 Yolk to Prestige");
    return;
  }

  game.yolk = 0;
  game.clickPower = 1;
  game.prestige += 1;

  updateUI();
};

// ---------- UPDATE UI ----------
function updateUI() {
  document.getElementById("points").innerText = game.yolk;
  document.getElementById("rankDisplay").innerText = "Prestige " + game.prestige;
  document.getElementById("prestigeBtn").innerText = "Prestige (10000)";
}

});