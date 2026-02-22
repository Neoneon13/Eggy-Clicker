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

// =======================
// ACHIEVEMENTS SYSTEM
// =======================

const achievementList = [

  // Clicks
  { id:"click1", name:"First Crack", desc:"Click 1 time", check:()=>game.totalClicks>=1 },
  { id:"click100", name:"Egg Tapper", desc:"Click 100 times", check:()=>game.totalClicks>=100 },
  { id:"click1000", name:"Shell Breaker", desc:"Click 1,000 times", check:()=>game.totalClicks>=1000 },
  { id:"click10000", name:"Yolk Overlord", desc:"Click 10,000 times", check:()=>game.totalClicks>=10000 },

  // Points
  { id:"pts100", name:"Yolk Collector", desc:"Reach 100 Yolk", check:()=>game.points>=100 },
  { id:"pts1000", name:"Rich Egg", desc:"Reach 1,000 Yolk", check:()=>game.points>=1000 },
  { id:"pts10000", name:"Golden Egg", desc:"Reach 10,000 Yolk", check:()=>game.points>=10000 },
  { id:"pts100000", name:"Yolk Tycoon", desc:"Reach 100,000 Yolk", check:()=>game.points>=100000 },

  // Prestige
  { id:"prest1", name:"Bronze I", desc:"Prestige once", check:()=>game.prestige>=1 },
  { id:"prest2", name:"Bronze II", desc:"Reach Bronze II", check:()=>game.prestige>=2 },
  { id:"prest3", name:"Silver I", desc:"Reach Silver", check:()=>game.prestige>=3 },
  { id:"prest4", name:"Silver II", desc:"Reach Silver II", check:()=>game.prestige>=4 },
  { id:"prest5", name:"Gold I", desc:"Reach Gold", check:()=>game.prestige>=5 },
  { id:"prest6", name:"Gold II", desc:"Reach Gold II", check:()=>game.prestige>=6 },
  { id:"prest7", name:"Diamond I", desc:"Reach Diamond", check:()=>game.prestige>=7 },
  { id:"prest8", name:"Master I", desc:"Reach Master", check:()=>game.prestige>=8 },

  // Crit streak
  { id:"crit5", name:"Lucky Egg", desc:"5 crit streak", check:()=>game.maxCritStreak>=5 },
  { id:"crit10", name:"Crit Machine", desc:"10 crit streak", check:()=>game.maxCritStreak>=10 },
  { id:"crit20", name:"Crit God", desc:"20 crit streak", check:()=>game.maxCritStreak>=20 },

  // CPS
  { id:"cps5", name:"Speed Tapper", desc:"5 CPS", check:()=>clickTimes.length>=5 },
  { id:"cps10", name:"Turbo Tapper", desc:"10 CPS", check:()=>clickTimes.length>=10 },
  { id:"cps20", name:"Finger Destroyer", desc:"20 CPS", check:()=>clickTimes.length>=20 },

  // Forms
  { id:"cool", name:"Too Cool", desc:"Equip Cool Egg", check:()=>forms[game.form]==="Cool" },
  { id:"tophat", name:"Fancy Egg", desc:"Equip Top Hat", check:()=>forms[game.form]==="Top Hat" },
  { id:"crown", name:"Royal Egg", desc:"Equip Crown", check:()=>forms[game.form]==="Crown" },

  // Auto
  { id:"auto10", name:"Auto Beginner", desc:"10 auto", check:()=>game.autoValue>=10 },
  { id:"auto50", name:"Auto Builder", desc:"50 auto", check:()=>game.autoValue>=50 },
  { id:"auto100", name:"Auto Factory", desc:"100 auto", check:()=>game.autoValue>=100 },

  // Prestige Power
  { id:"prest10", name:"Ultimate Master", desc:"Prestige 10 times", check:()=>game.prestige>=10 }

];

function buildAchievements(){
  const container = document.getElementById("achievementList");
  container.innerHTML = "";

  achievementList.forEach(a=>{
    const div = document.createElement("div");
    div.className = "achievement";
    div.id = "ach-"+a.id;
    div.innerHTML = "<b>"+a.name+"</b><br>"+a.desc;
    container.appendChild(div);
  });
}

function checkAchievements(){
  achievementList.forEach(a=>{
    if(!game.achievements.includes(a.id) && a.check()){
      unlockAchievement(a.id,a.name);
    }
  });
}

function unlockAchievement(id,name){
  game.achievements.push(id);

  const div = document.getElementById("ach-"+id);
  if(div){
    div.classList.add("unlocked");
  }

  notify("Achievement Unlocked: "+name);
}

// =======================
// WARDROBE SYSTEM
// =======================

function buildWardrobe(){
  const container = document.getElementById("wardrobeItems");
  container.innerHTML = "";

  const tierCount = Math.min(game.prestige + 1, tiers.length);

  for(let t = 0; t < tierCount; t++){
    for(let f = 0; f < forms.length; f++){

      const id = t + "-" + f;
      const div = document.createElement("div");
      div.className = "skinItem";

      const price = getSkinPrice(t,f);
      const owned = game.ownedSkins.includes(id);
      const equipped = (game.form === f && game.prestige === t);

      div.innerHTML = `
        <b>${tiers[t]} ${forms[f]}</b><br>
        ${owned ? "Owned" : price + " Yolk"}
      `;

      if(equipped){
        div.classList.add("equipped");
      }

      div.onclick = () => {

        // LOCK CHECK
        if(game.prestige < t){
          notify("LOCKED");
          return;
        }

        // BUY
        if(!owned){
          if(game.points < price){
            notify("Not enough Yolk!");
            return;
          }
          game.points -= price;
          game.ownedSkins.push(id);
          notify("Purchased!");
        }

        // EQUIP
        game.form = f;
        game.prestige = t;
        notify("Equipped!");

        updateUI();
        buildWardrobe();
      };

      container.appendChild(div);
    }
  }
}

// ---------- PRICE LOGIC ----------
function getSkinPrice(t,f){

  let base = 0;

  if(t === 0){ base = 100; }
  if(t === 1){ base = 500; }
  if(t === 2){ base = 2000; }
  if(t === 3){ base = 10000; }
  if(t === 4){ base = 50000; }
  if(t === 5){ base = 250000; }
  if(t === 6){ base = 1000000; }
  if(t === 7){ base = 5000000; }
  if(t >= 8){ base = 25000000; } // MASTER INSANE

  return base * (f + 1);
}

// ---------- BETTER EGG = BETTER REWARD ----------
const originalClick = game.clickValue;

function applyEggBonus(){
  let multiplier = 1;

  if(forms[game.form] === "Cool") multiplier = 1.1;
  if(forms[game.form] === "Top Hat") multiplier = 1.25;
  if(forms[game.form] === "Crown") multiplier = 1.5;

  multiplier += game.prestige * 0.05;

  game.clickValue = originalClick * multiplier;
}

// Run bonus every update
setInterval(applyEggBonus,500);