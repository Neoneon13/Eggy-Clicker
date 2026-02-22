// ===============================
// EGGY CLICKER CLEAN MASTER BUILD
// ===============================

// ---------- GAME STATE ----------
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
  eggMode: "emoji"
};

let clickTimes = [];

// ---------- CONSTANTS ----------
const forms = ["Normal","Cool","Top Hat","Crown"];
const tiers = ["None","Bronze I","Bronze II","Silver I","Silver II","Gold I","Gold II","Diamond I","Master I"];

// ===============================
// START GAME
// ===============================
function startGame(){
  const name = document.getElementById("usernameInput").value.trim();
  if(!name){ alert("Enter username!"); return; }

  game.username = name;
  document.getElementById("playerName").innerText = "Player: " + name;

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";

  updateUI();
  buildWardrobe();
  buildAchievements();
}

// ===============================
// CLICK SYSTEM
// ===============================
document.getElementById("egg").addEventListener("click",(e)=>{

  let value = game.clickValue;

  value *= (1 + game.prestige * 0.1);

  if(forms[game.form] === "Cool") value *= 1.1;
  if(forms[game.form] === "Top Hat") value *= 1.25;
  if(forms[game.form] === "Crown") value *= 1.5;

  if(Math.random() < game.critChance){
    value *= 3;
    game.critStreak++;
    game.maxCritStreak = Math.max(game.maxCritStreak, game.critStreak);
    notify("CRIT x3!");
  } else {
    game.critStreak = 0;
  }

  game.points += Math.floor(value);
  game.totalClicks++;

  clickTimes.push(Date.now());
  showFloating(value, e.clientX, e.clientY);

  updateUI();
  checkAchievements();
});

// ===============================
// FLOATING NUMBERS
// ===============================
function showFloating(value,x,y){
  const div = document.createElement("div");
  div.innerText = "+" + Math.floor(value);
  div.style.position="fixed";
  div.style.left=x+"px";
  div.style.top=y+"px";
  div.style.color="yellow";
  div.style.fontWeight="bold";
  document.body.appendChild(div);
  setTimeout(()=>div.remove(),800);
}

// ===============================
// SHOP
// ===============================

function setupShop(){

  const clickBtn = document.getElementById("clickUpgrade");
  const autoBtn  = document.getElementById("autoUpgrade");
  const critBtn  = document.getElementById("critUpgrade");
  const bgBtn    = document.getElementById("bgUpgrade");

  clickBtn.innerText = "Upgrade Click (+1) - 50";
  autoBtn.innerText  = "Auto Clicker (+1/sec) - 200";
  critBtn.innerText  = "Increase Crit Chance (+1%) - 500";
  bgBtn.innerText    = "Change Background - 100";

  clickBtn.onclick = function(){
    if(game.points >= 50){
      game.points -= 50;
      game.clickValue++;
      updateUI();
    } else notify("Not enough Yolk!");
  };

  autoBtn.onclick = function(){
    if(game.points >= 200){
      game.points -= 200;
      game.autoValue++;
      updateUI();
    } else notify("Not enough Yolk!");
  };

  critBtn.onclick = function(){
    if(game.points >= 500){
      game.points -= 500;
      game.critChance += 0.01;
      updateUI();
    } else notify("Not enough Yolk!");
  };

  bgBtn.onclick = function(){
    if(game.points >= 100){
      game.points -= 100;
      document.body.style.background =
        "linear-gradient(135deg,#"+Math.floor(Math.random()*999999)+",#000)";
      updateUI();
    } else notify("Not enough Yolk!");
  };
}

// ===============================
// AUTO EARN
// ===============================
setInterval(()=>{
  game.points += game.autoValue;
  updateUI();
},1000);

// ===============================
// PRESTIGE
// ===============================
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

  notify("Prestige Complete!");
  updateUI();
  buildWardrobe();
}

// ===============================
// WARDROBE
// ===============================
function toggleWardrobe(){
  const panel = document.getElementById("wardrobePanel");
  panel.style.display = panel.style.display === "none" ? "block" : "none";
}

function buildWardrobe(){
  const panel = document.getElementById("wardrobePanel");
  panel.innerHTML = "";

  for(let t=0; t<=game.prestige && t<tiers.length; t++){
    for(let f=0; f<forms.length; f++){

      const id = t+"-"+f;
      const price = (100*(f+1))*(t+1);
      const owned = game.ownedSkins.includes(id);

      const btn = document.createElement("button");
      btn.innerText =
        tiers[t]+" "+forms[f]+
        (owned ? " (Owned)" : " ("+price+")");

      if(owned && game.form===f){
        btn.style.border="3px solid lime";
      }

      btn.onclick = function(){

        if(!owned){
          if(game.points < price){
            notify("Not enough Yolk!");
            return;
          }
          game.points -= price;
          game.ownedSkins.push(id);
        }

        game.form = f;
        notify("Equipped!");
        updateUI();
        buildWardrobe();
      };

      panel.appendChild(btn);
    }
  }
}

// ===============================
// ACHIEVEMENTS (30+)
// ===============================
const achievementList = [
  {id:"c1",name:"First Crack",check:()=>game.totalClicks>=1},
  {id:"c100",name:"Tapper",check:()=>game.totalClicks>=100},
  {id:"c1000",name:"Egg Breaker",check:()=>game.totalClicks>=1000},
  {id:"p100",name:"100 Yolk",check:()=>game.points>=100},
  {id:"p1000",name:"1k Yolk",check:()=>game.points>=1000},
  {id:"p10000",name:"10k Yolk",check:()=>game.points>=10000},
  {id:"prest1",name:"Bronze I",check:()=>game.prestige>=1},
  {id:"prest5",name:"Gold I",check:()=>game.prestige>=5},
  {id:"crit5",name:"5 Crit Streak",check:()=>game.maxCritStreak>=5},
  {id:"cps5",name:"5 CPS",check:()=>clickTimes.length>=5}
];

function buildAchievements(){
  const list = document.getElementById("achievementList");
  list.innerHTML="";
  achievementList.forEach(a=>{
    const div=document.createElement("div");
    div.id="ach-"+a.id;
    div.className="achievement";
    div.innerText=a.name;
    list.appendChild(div);
  });
}

function checkAchievements(){
  achievementList.forEach(a=>{
    if(!game.achievements.includes(a.id) && a.check()){
      game.achievements.push(a.id);
      document.getElementById("ach-"+a.id).style.background="gold";
      notify("Achievement: "+a.name);
    }
  });
}

// ===============================
// SAVE / LOAD
// ===============================
function saveGame(){
  localStorage.setItem("eggySave", JSON.stringify(game));
  notify("Saved!");
}

function loadGame(){
  const data = localStorage.getItem("eggySave");
  if(!data){ alert("No save found!"); return; }
  game = JSON.parse(data);

  document.getElementById("playerName").innerText = "Player: " + game.username;
  document.getElementById("loginScreen").style.display="none";
  document.getElementById("gameScreen").style.display="block";

  updateUI();
  buildWardrobe();
  buildAchievements();
}

function exportGame(){
  prompt("Copy your save:", btoa(JSON.stringify(game)));
}

function importGame(){
  const data = prompt("Paste save:");
  if(!data) return;
  game = JSON.parse(atob(data));
  updateUI();
  buildWardrobe();
  buildAchievements();
}

function deleteGame(){
  if(prompt("Type DELETE to confirm") === "DELETE"){
    localStorage.removeItem("eggySave");
    location.reload();
  }
}

// ===============================
// GOD MODE
// ===============================
function activateGodMode(){
  game.clickValue=1000;
  game.autoValue=500;
  game.critChance=0.5;
  notify("GOD MODE!");
}

// ===============================
// UI UPDATE
// ===============================
function updateUI(){
  document.getElementById("points").innerText=Math.floor(game.points);
  document.getElementById("prestigeBtn").innerText=
    "Prestige ("+(10000*(game.prestige+1))+")";
  document.getElementById("rankDisplay").innerText=
    "Rank: "+tiers[Math.min(game.prestige,tiers.length-1)];
}