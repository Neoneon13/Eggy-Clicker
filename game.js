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
  achievements: []
};

// ---------- START ----------

window.startGame = function () {
  const input = document.getElementById("usernameInput");
  if (!input.value.trim()) return alert("Enter username");

  game.username = input.value.trim();

  document.getElementById("playerName").innerText = game.username;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");

  loadSave();
  renderAchievements();
  updateUI();
};

// ---------- CLICK ----------

const egg = document.getElementById("egg");

egg.addEventListener("click", function () {

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

  checkAchievements();
  updateUI();
});

// ---------- AUTO CPS ----------

setInterval(function () {
  if (game.autoPower > 0) {
    game.yolk += game.autoPower;
    game.totalEarned += game.autoPower;
    updateUI();
  }
}, 1000);

// ---------- SHOP ----------

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

// ---------- PRESTIGE ----------

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

// ---------- BACKGROUND ----------

window.changeBackground = function () {
  const hue = Math.floor(Math.random() * 360);
  const color = "hsl(" + hue + ", 80%, 95%)";
  document.body.style.background = color;
  game.background = color;
};

// ---------- SAVE SYSTEM ----------

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
    renderAchievements();
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

// Auto save every 30 sec
setInterval(function () {
  localStorage.setItem("eggySave", JSON.stringify(game));
}, 30000);

// ---------- ACHIEVEMENTS ----------

const achievementList = [];

for (let i = 1; i <= 50; i++) {
  achievementList.push({
    id: "click" + i,
    name: "Click Master " + i,
    condition: () => game.totalClicks >= i * 100
  });
}

achievementList.push(
  { id:"crit3", name:"Lucky Crack", condition:()=>game.maxCritStreak>=3 },
  { id:"crit5", name:"CRACK MASTER", condition:()=>game.maxCritStreak>=5 },
  { id:"crit10", name:"CRIT LEGEND", condition:()=>game.maxCritStreak>=10 },
  { id:"p1", name:"Reborn", condition:()=>game.prestige>=1 },
  { id:"p5", name:"Ascended", condition:()=>game.prestige>=5 }
);

function checkAchievements(){
  achievementList.forEach(a=>{
    if(!game.achievements.includes(a.id) && a.condition()){
      game.achievements.push(a.id);
      alert("🏆 Achievement Unlocked: "+a.name);
      renderAchievements();
    }
  });
}

function renderAchievements(){
  const container=document.getElementById("achievementList");
  if(!container) return;

  container.innerHTML="";

  achievementList.forEach(a=>{
    const unlocked=game.achievements.includes(a.id);
    const div=document.createElement("div");
    div.innerText=unlocked? "✅ "+a.name : "🔒 Locked";
    container.appendChild(div);
  });
}

// ---------- UI ----------

function updateUI(){
  document.getElementById("points").innerText = Math.floor(game.yolk);
  document.getElementById("rankDisplay").innerText = "Prestige " + game.prestige;
  document.getElementById("prestigeBtn").innerText =
    "Prestige (" + (10000 * (game.prestige + 1)) + ")";
  document.getElementById("cpsDisplay").innerText =
    "CPS: " + game.autoPower;
}

});