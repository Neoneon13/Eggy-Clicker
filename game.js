// =======================
// EGGY CLICKER MASTER CORE
// =======================

// ---------- GAME DATA ----------
let game = {
  username: "",
  points: 0,
  clickValue: 1,
  autoValue: 0,
  critChance: 0.05,
  prestige: 0,
  form: 0,
  ownedSkins: ["0-0"],
  achievements: [],
  totalClicks: 0,
  critStreak: 0,
  maxCritStreak: 0,
  eggMode: "emoji",
  lastSave: Date.now()
};

let clickTimes = [];

// ---------- CONSTANTS ----------
const forms = ["Normal","Cool","Top Hat","Crown"];
const tiers = ["None","Bronze","Bronze II","Silver","Silver II","Gold","Gold II","Diamond","Master"];

// ---------- START ----------
function startGame(){
  const name = document.getElementById("usernameInput").value.trim();
  if(name === ""){
    alert("Enter username!");
    return;
  }

  game.username = name;
  document.getElementById("playerName").innerText = "Player: " + name;

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";

  updateUI();
  buildWardrobe();
  buildAchievements();
  startAuto();
  startCPSCounter();
}

// ---------- CLICK ----------
document.addEventListener("click",function(e){
  if(e.target.id !== "egg") return;

  let value = game.clickValue;

  // Prestige multiplier
  value *= (1 + game.prestige * 0.1);

  // Crown bonus
  if(forms[game.form] === "Crown"){
    value *= 1.2;
  }

  // Crit
  if(Math.random() < game.critChance){
    value *= 3;
    game.critStreak++;
    if(game.critStreak > game.maxCritStreak){
      game.maxCritStreak = game.critStreak;
    }
    notify("CRIT x3!");
  } else {
    game.critStreak = 0;
  }

  game.points += Math.floor(value);
  game.totalClicks++;

  showFloating(value,e.clientX,e.clientY);
  updateUI();
  checkAchievements();
});

// ---------- FLOATING NUMBERS ----------
function showFloating(value,x,y){
  const div = document.createElement("div");
  div.innerText = "+" + Math.floor(value);
  div.style.position="fixed";
  div.style.left = x+"px";
  div.style.top = y+"px";
  div.style.color="yellow";
  div.style.fontWeight="bold";
  document.body.appendChild(div);

  setTimeout(()=>div.remove(),800);
}

// ---------- AUTO ----------
function startAuto(){
  setInterval(()=>{
    game.points += game.autoValue;
    updateUI();
  },1000);
}

// ---------- CPS ----------
function startCPSCounter(){
  setInterval(()=>{
    const now = Date.now();
    clickTimes = clickTimes.filter(t=>now-t<1000);
    document.getElementById("cps").innerText = clickTimes.length;
  },200);
}

document.getElementById("egg").addEventListener("click",()=>{
  clickTimes.push(Date.now());
});

// ---------- PRESTIGE ----------
function prestige(){
  const cost = 10000 * (game.prestige + 1);
  if(game.points < cost){
    notify("Not enough Yolk!");
    return;
  }

  game.prestige++;
  game.points = 0;
  game.clickValue = 1;
  game.autoValue = 0;
  game.critChance = 0.05;
  game.form = 0;

  notify("Prestiged!");
  updateUI();
  buildWardrobe();
}

// ---------- UI ----------
function updateUI(){
  document.getElementById("points").innerText = Math.floor(game.points);
  document.getElementById("prestigeBtn").innerText =
    "Prestige (" + (10000*(game.prestige+1)) + ")";

  document.getElementById("rankDisplay").innerText =
    "Rank: " + tiers[Math.min(game.prestige, tiers.length-1)];

  applyRankEffect();
}

// ---------- RANK EFFECT ----------
function applyRankEffect(){
  const egg = document.getElementById("egg");
  egg.classList.remove("masterGlow","diamondGlow");

  if(game.prestige >= 8){
    egg.classList.add("masterGlow");
  } else if(game.prestige >= 6){
    egg.classList.add("diamondGlow");
  }
}

// ---------- NOTIFICATION ----------
function notify(text){
  const n = document.getElementById("notification");
  n.innerText = text;
  n.style.display="block";
  setTimeout(()=>n.style.display="none",1500);
}