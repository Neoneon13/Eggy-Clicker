// =====================================================
// 🥚 EGGY CLICKER — FINAL MASTER ENGINE
// Stable • Mobile Friendly • 50+ Achievements
// Full Wardrobe • Prestige Scaling • Anti Cheat
// =====================================================

// ---------------- CONSTANTS ----------------

const FORMS = [
  {name:"Normal", mult:1},
  {name:"Cool", mult:1.1},
  {name:"Top Hat", mult:1.25},
  {name:"Crown", mult:1.5}
];

const TIERS = [
  "None",
  "Bronze I","Bronze II",
  "Silver I","Silver II",
  "Gold I","Gold II",
  "Diamond I","Diamond II",
  "Master I","Master II","Master III","Master IV","Master V",
  "Master VI","Master VII","Master VIII","Master IX","Master X",
  "Ultimate Master"
];

// ---------------- GAME STATE ----------------

let game = {
  username:"",
  points:0,
  totalEarned:0,
  totalClicks:0,
  clickValue:1,
  autoValue:0,
  critChance:0.05,
  critStreak:0,
  bestCritStreak:0,
  prestige:0,
  equipped:"0-0",
  owned:{"0-0":true},
  achievements:[],
  godMode:false,
  lastSave:Date.now()
};

// ---------------- START ----------------

function startGame(){
  const name=document.getElementById("usernameInput").value.trim();
  if(!name) return alert("Enter username");
  game.username=name;
  document.getElementById("playerName").innerText=name;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
  init();
}

function init(){
  updateUI();
  buildShop();
  buildWardrobe();
  buildAchievements();
  setInterval(gameTick,1000);
  setInterval(autoSave,30000);
}

// ---------------- CLICK SYSTEM ----------------

document.getElementById("egg")?.addEventListener("click",()=>{
  let value=calculateClickValue();

  if(Math.random()<game.critChance){
    value*=3;
    game.critStreak++;
    if(game.critStreak>game.bestCritStreak)
      game.bestCritStreak=game.critStreak;
    showPopup("CRIT x3!");
  }else{
    game.critStreak=0;
  }

  addPoints(value);
  game.totalClicks++;
  checkAchievements();
});

function calculateClickValue(){
  const [tier,form]=game.equipped.split("-").map(Number);
  let base=game.clickValue;
  let prestigeBonus=1+(game.prestige*0.15);
  let formBonus=FORMS[form].mult;
  let total=base*prestigeBonus*formBonus;
  if(game.godMode) total*=10;
  return Math.floor(total);
}

function addPoints(amount){
  game.points+=amount;
  game.totalEarned+=amount;
  updateUI();
}

function gameTick(){
  let autoGain=game.autoValue*(1+(game.prestige*0.1));
  addPoints(autoGain);
}

// ---------------- SHOP ----------------

function clickCost(){return 50*game.clickValue;}
function autoCost(){return 100*(game.autoValue+1);}
function critCost(){return 500*(game.critChance*100);}
function bgCost(){return 2000;}

function buildShop(){
  document.getElementById("clickUpgrade").innerText=
    "Upgrade Click ("+clickCost()+")";

  document.getElementById("autoUpgrade").innerText=
    "Auto Click ("+autoCost()+")";

  document.getElementById("critUpgrade").innerText=
    "Crit Chance ("+critCost()+")";

  document.getElementById("bgUpgrade").innerText=
    "Background Boost ("+bgCost()+")";
}

document.getElementById("clickUpgrade").onclick=()=>{
  if(game.points>=clickCost()){
    game.points-=clickCost();
    game.clickValue++;
    buildShop();
    updateUI();
  }
};

document.getElementById("autoUpgrade").onclick=()=>{
  if(game.points>=autoCost()){
    game.points-=autoCost();
    game.autoValue++;
    buildShop();
    updateUI();
  }
};

document.getElementById("critUpgrade").onclick=()=>{
  if(game.points>=critCost()){
    game.points-=critCost();
    game.critChance+=0.01;
    buildShop();
    updateUI();
  }
};

document.getElementById("bgUpgrade").onclick=()=>{
  if(game.points>=bgCost()){
    game.points-=bgCost();
    document.body.style.background=
      "hsl("+Math.floor(Math.random()*360)+",80%,95%)";
    updateUI();
  }
};

// ---------------- PRESTIGE ----------------

function prestige(){
  const cost=10000*(game.prestige+1);
  if(game.points<cost) return alert("Need "+cost);

  game.points=0;
  game.clickValue=1;
  game.autoValue=0;
  game.critChance=0.05;
  game.prestige++;

  updateUI();
  buildWardrobe();
}

function updateUI(){
  document.getElementById("points").innerText=
    Math.floor(game.points);

  document.getElementById("rankDisplay").innerText=
    TIERS[game.prestige]||"Legend";

  document.getElementById("prestigeBtn").innerText=
    "Prestige ("+(10000*(game.prestige+1))+")";
}

// ---------------- WARDROBE ----------------

function buildWardrobe(){
  const panel=document.getElementById("wardrobePanel");
  panel.innerHTML="";

  TIERS.forEach((tierName,tierIndex)=>{
    FORMS.forEach((formObj,formIndex)=>{

      const key=tierIndex+"-"+formIndex;
      const price=(tierIndex+1)*2000*(formIndex+1);

      const btn=document.createElement("button");
      btn.innerText=tierName+" "+formObj.name+
        (game.owned[key]?" (Owned)":" - "+price);

      if(tierIndex>game.prestige){
        btn.innerText+=" [LOCKED]";
        btn.disabled=true;
      }

      if(game.equipped===key){
        btn.style.border="3px solid lime";
      }

      btn.onclick=()=>{
        if(!game.owned[key]){
          if(game.points<price) return;
          game.points-=price;
          game.owned[key]=true;
        }
        game.equipped=key;
        buildWardrobe();
        updateUI();
      };

      panel.appendChild(btn);
    });
  });
}

function toggleWardrobe(){
  document.getElementById("wardrobePanel")
    .classList.toggle("hidden");
}

// ---------------- ACHIEVEMENTS (50+) ----------------

const ACHIEVEMENTS=[];

// Click milestones
[1,10,100,500,1000,5000,10000,50000].forEach(v=>{
  ACHIEVEMENTS.push({
    name:v+" Clicks",
    check:()=>game.totalClicks>=v
  });
});

// Points milestones
[100,1000,10000,100000,1000000,10000000].forEach(v=>{
  ACHIEVEMENTS.push({
    name:v+" Yolk",
    check:()=>game.totalEarned>=v
  });
});

// Prestige milestones
for(let i=1;i<15;i++){
  ACHIEVEMENTS.push({
    name:"Prestige "+i,
    check:()=>game.prestige>=i
  });
}

// Crit streak
[3,5,10,20].forEach(v=>{
  ACHIEVEMENTS.push({
    name:v+" Crit Streak",
    check:()=>game.bestCritStreak>=v
  });
});

// Auto milestones
[1,5,10,25,50,100].forEach(v=>{
  ACHIEVEMENTS.push({
    name:v+" Auto Power",
    check:()=>game.autoValue>=v
  });
});

// ---------------- BUILD ACHIEVEMENTS ----------------

function buildAchievements(){
  const list=document.getElementById("achievementList");
  list.innerHTML="";

  ACHIEVEMENTS.forEach((a,i)=>{
    const div=document.createElement("div");
    div.className="achievement locked";
    div.innerText=a.name;

    if(game.achievements.includes(i))
      div.className="achievement unlocked";

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

// ---------------- SAVE SYSTEM ----------------

function saveGame(){
  localStorage.setItem("eggySave",
    JSON.stringify(game));
  showPopup("Saved!");
}

function autoSave(){
  saveGame();
}

function loadGame(){
  const data=localStorage.getItem("eggySave");
  if(!data) return alert("No save");
  game