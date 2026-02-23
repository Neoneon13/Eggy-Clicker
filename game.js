// ===============================
// 🥚 EGGY CLICKER MASTER ENGINE
// Clean Stable Build
// ===============================

// ---------- CONSTANTS ----------

const FORMS = ["Normal","Cool","Top Hat","Crown"];

const PRESTIGE_TIERS = [
  "None",
  "Bronze","Bronze II",
  "Silver","Silver II",
  "Gold","Gold II",
  "Diamond","Diamond II",
  "Master I","Master II","Master III","Master IV","Master V",
  "Master VI","Master VII","Master VIII","Master IX","Master X",
  "Ultimate Master"
];

// ---------- GAME STATE ----------

let game = {
  username: "",
  points: 0,
  totalClicks: 0,
  clickValue: 1,
  autoValue: 0,
  critChance: 0.05,
  prestige: 0,
  form: 0,
  tierOwned: {}, // "tier-form": true
  equipped: "0-0",
  achievements: [],
  cps: 0,
  lastTick: Date.now(),
  godMode: false
};

// ---------- START ----------

function startGame(){
  const name = document.getElementById("usernameInput").value.trim();
  if(!name) return alert("Enter username");
  game.username = name;
  document.getElementById("playerName").innerText = name;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  init();
}

function init(){
  updateRank();
  updateStats();
  buildShop();
  buildWardrobe();
  buildAchievements();
  setInterval(tick,1000);
  setInterval(autoSave,30000);
}

// ---------- CLICKING ----------

const egg = document.getElementById("egg");
if(egg){
  egg.addEventListener("click", ()=>{

    if(Math.random() < game.critChance){
      addPoints(game.clickValue * 5);
      showPopup("CRIT!");
    } else {
      addPoints(game.clickValue);
    }

    game.totalClicks++;
    checkAchievements();
  });
}

function addPoints(amount){
  if(game.godMode) amount *= 10;
  game.points += amount;
  updateStats();
}

function tick(){
  game.points += game.autoValue;
  game.cps = game.autoValue;
  updateStats();
}

// ---------- SHOP ----------

function buildShop(){
  document.getElementById("clickUpgrade").innerText =
    "Upgrade Click (" + clickCost() + ")";

  document.getElementById("autoUpgrade").innerText =
    "Auto Click (" + autoCost() + ")";

  document.getElementById("critUpgrade").innerText =
    "Crit Chance (" + critCost() + ")";

  document.getElementById("bgUpgrade").innerText =
    "Background Boost (" + bgCost() + ")";
}

function clickCost(){ return 50 * game.clickValue; }
function autoCost(){ return 100 * (game.autoValue+1); }
function critCost(){ return 500 * (game.critChance*20); }
function bgCost(){ return 1000; }

document.getElementById("clickUpgrade").onclick = ()=>{
  if(game.points >= clickCost()){
    game.points -= clickCost();
    game.clickValue++;
    buildShop();
  }
};

document.getElementById("autoUpgrade").onclick = ()=>{
  if(game.points >= autoCost()){
    game.points -= autoCost();
    game.autoValue++;
    buildShop();
  }
};

document.getElementById("critUpgrade").onclick = ()=>{
  if(game.points >= critCost()){
    game.points -= critCost();
    game.critChance += 0.01;
    buildShop();
  }
};

document.getElementById("bgUpgrade").onclick = ()=>{
  if(game.points >= bgCost()){
    game.points -= bgCost();
    document.body.style.background =
      "hsl(" + Math.floor(Math.random()*360) + ",100%,95%)";
  }
};

// ---------- PRESTIGE ----------

function prestige(){
  if(game.points < 10000) return alert("Need 10k");

  game.points = 0;
  game.clickValue = 1;
  game.autoValue = 0;
  game.critChance = 0.05;
  game.prestige++;
  game.equipped = game.prestige + "-0";

  updateRank();
  updateStats();
  buildWardrobe();
}

function updateRank(){
  document.getElementById("rankDisplay").innerText =
    PRESTIGE_TIERS[game.prestige] || "Legend";
}

// ---------- WARDROBE ----------

function buildWardrobe(){
  const panel = document.getElementById("wardrobePanel");
  panel.innerHTML = "";

  PRESTIGE_TIERS.forEach((tierName,tierIndex)=>{

    FORMS.forEach((formName,formIndex)=>{

      const key = tierIndex+"-"+formIndex;
      const btn = document.createElement("button");

      const price = (tierIndex+1) * 1000 * (formIndex+1);

      btn.innerText =
        tierName + " " + formName + " ("+price+")";

      if(tierIndex > game.prestige){
        btn.innerText += " [LOCKED]";
        btn.disabled = true;
      }

      if(game.equipped === key){
        btn.style.border = "3px solid green";
      }

      btn.onclick = ()=>{
        if(game.points >= price){
          game.points -= price;
          game.tierOwned[key] = true;
          game.equipped = key;
          buildWardrobe();
        }
      };

      panel.appendChild(btn);
    });
  });
}

function toggleWardrobe(){
  document.getElementById("wardrobePanel").classList.toggle("hidden");
}

// ---------- ACHIEVEMENTS ----------

const ACHIEVEMENTS = [
  {name:"First Click", check:()=>game.totalClicks>=1},
  {name:"100 Clicks", check:()=>game.totalClicks>=100},
  {name:"1k Points", check:()=>game.points>=1000},
  {name:"10k Points", check:()=>game.points>=10000},
  {name:"100k Points", check:()=>game.points>=100000},
  {name:"First Prestige", check:()=>game.prestige>=1},
  {name:"Bronze II", check:()=>game.prestige>=2},
  {name:"Silver Rank", check:()=>game.prestige>=3},
  {name:"Gold Rank", check:()=>game.prestige>=5},
  {name:"Diamond Rank", check:()=>game.prestige>=7},
  {name:"Master I", check:()=>game.prestige>=9},
  {name:"Ultimate Master", check:()=>game.prestige>=19}
];

function buildAchievements(){
  const list = document.getElementById("achievementList");
  list.innerHTML = "";

  ACHIEVEMENTS.forEach((a,i)=>{
    const div = document.createElement("div");
    div.className = "achievement locked";
    div.innerText = a.name;

    if(game.achievements.includes(i)){
      div.className = "achievement unlocked";
    }

    list.appendChild(div);
  });
}

function checkAchievements(){
  ACHIEVEMENTS.forEach((a,i)=>{
    if(!game.achievements.includes(i) && a.check()){
      game.achievements.push(i);
      showPopup("Achievement: "+a.name);
      buildAchievements();
    }
  });
}

// ---------- POPUP ----------

function showPopup(text){
  const pop = document.createElement("div");
  pop.innerText = text;
  pop.style.position="fixed";
  pop.style.top="20px";
  pop.style.left="50%";
  pop.style.transform="translateX(-50%)";
  pop.style.background="#222";
  pop.style.color="#fff";
  pop.style.padding="10px";
  pop.style.borderRadius="8px";
  document.body.appendChild(pop);
  setTimeout(()=>pop.remove(),2000);
}

// ---------- SAVE SYSTEM ----------

function saveGame(){
  localStorage.setItem("eggySave", JSON.stringify(game));
  showPopup("Game Saved!");
}

function autoSave(){
  saveGame();
}

function loadGame(){
  const data = localStorage.getItem("eggySave");
  if(!data) return alert("No save found");
  game = JSON.parse(data);
  document.getElementById("playerName").innerText = game.username;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  init();
}

function exportGame(){
  prompt("Copy this save:", btoa(JSON.stringify(game)));
}

function importGame(){
  const code = prompt("Paste save:");
  if(!code) return;
  game = JSON.parse(atob(code));
  saveGame();
  loadGame();
}

function deleteGame(){
  const confirmDelete = prompt("Type DELETE to confirm");
  if(confirmDelete === "DELETE"){
    localStorage.removeItem("eggySave");
    location.reload();
  }
}

// ---------- GOD MODE ----------

function activateGodMode(){
  game.godMode = true;
  showPopup("God Mode Activated");
}

// ---------- STATS ----------

function updateStats(){
  document.getElementById("points").innerText =
    Math.floor(game.points);

  document.getElementById("cps").innerText =
    game.cps;
}

// ---------- EVENT ----------

function goToEvent(){
  window.location.href = "event.html";
}