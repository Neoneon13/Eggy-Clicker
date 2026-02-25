// ================= GAME STATE =================
let game = {
  points: 0,
  clickValue: 1,
  autoValue: 0,
  critChance: 0.05,
  prestige: 0,
  totalClicks: 0,
  ownedSkins: ["0-0"],
  equipped: "0-0"
};

const forms = ["Normal","Cool","Top Hat","Crown"];
const tiers = ["None","Bronze I","Bronze II","Silver I","Silver II","Gold I","Gold II","Diamond I","Master I"];

let clickTimes = [];

// ================= CLICK =================
const egg = document.getElementById("egg");

egg.addEventListener("click", () => {

  let value = game.clickValue;

  // Prestige bonus
  value *= (1 + game.prestige * 0.2);

  // Form bonus
  let formIndex = parseInt(game.equipped.split("-")[1]);
  if(formIndex === 1) value *= 1.2;
  if(formIndex === 2) value *= 1.5;
  if(formIndex === 3) value *= 2;

  // Crit
  if(Math.random() < game.critChance){
    value *= 3;
  }

  game.points += Math.floor(value);
  game.totalClicks++;

  clickTimes.push(Date.now());

  updateUI();
  checkAchievements();
});

// ================= CPS =================
setInterval(() => {
  let now = Date.now();
  clickTimes = clickTimes.filter(t => now - t < 1000);
  document.getElementById("cps").innerText = clickTimes.length;
}, 200);

// ================= AUTO CLICK =================
setInterval(() => {
  game.points += game.autoValue;
  updateUI();
}, 1000);

// ================= SHOP =================
document.getElementById("clickUpgrade").addEventListener("click", () => {
  let cost = 50 * game.clickValue;
  if(game.points >= cost){
    game.points -= cost;
    game.clickValue++;
    updateUI();
  }
});

document.getElementById("autoUpgrade").addEventListener("click", () => {
  let cost = 200 * (game.autoValue + 1);
  if(game.points >= cost){
    game.points -= cost;
    game.autoValue++;
    updateUI();
  }
});

document.getElementById("critUpgrade").addEventListener("click", () => {
  let cost = 500;
  if(game.points >= cost){
    game.points -= cost;
    game.critChance += 0.01;
    updateUI();
  }
});

// ================= PRESTIGE =================
document.getElementById("prestigeBtn").addEventListener("click", () => {

  let cost = 10000 * (game.prestige + 1);

  if(game.points < cost) return;

  game.prestige++;
  game.points = 0;
  game.clickValue = 1;
  game.autoValue = 0;
  game.critChance = 0.05;

  updateUI();
});

// ================= WARDROBE =================
document.getElementById("wardrobeToggle").addEventListener("click", toggleWardrobe);

function toggleWardrobe(){
  let panel = document.getElementById("wardrobePanel");
  panel.classList.toggle("hidden");
  buildWardrobe();
}

function buildWardrobe(){
  let panel = document.getElementById("wardrobePanel");
  panel.innerHTML = "";

  for(let t = 0; t < tiers.length; t++){

    if(t > game.prestige) continue;

    for(let f = 0; f < forms.length; f++){

      let id = t + "-" + f;
      let owned = game.ownedSkins.includes(id);
      let price = 100 * (t + 1) * (f + 1);

      let btn = document.createElement("button");

      btn.innerText = tiers[t] + " " + forms[f] +
        (owned ? " (Owned)" : " - " + price);

      if(id === game.equipped){
        btn.style.border = "3px solid lime";
      }

      btn.addEventListener("click", () => {

        if(!owned){
          if(game.points < price) return;
          game.points -= price;
          game.ownedSkins.push(id);
        }

        game.equipped = id;
        buildWardrobe();
        updateUI();
      });

      panel.appendChild(btn);
    }
  }
}

// ================= ACHIEVEMENTS =================
const achievements = [
  {id:"c1", name:"First Crack", check:()=>game.totalClicks>=1},
  {id:"c100", name:"Egg Breaker", check:()=>game.totalClicks>=100},
  {id:"c1000", name:"Shell Destroyer", check:()=>game.totalClicks>=1000},
  {id:"p1", name:"Bronze Rank", check:()=>game.prestige>=1},
  {id:"p5", name:"Gold Rank", check:()=>game.prestige>=5}
];

function checkAchievements(){
  let list = document.getElementById("achievementList");
  list.innerHTML = "";

  achievements.forEach(a=>{
    let unlocked = a.check();

    let div = document.createElement("div");
    div.className = "achievement " + (unlocked ? "unlocked":"locked");
    div.innerText = a.name;

    list.appendChild(div);
  });
}

// ================= SAVE =================
document.getElementById("saveBtn").addEventListener("click", () => {
  localStorage.setItem("eggySave", JSON.stringify(game));
  alert("Game Saved!");
});

document.getElementById("deleteBtn").addEventListener("click", () => {
  let confirmDelete = prompt("Type DELETE to confirm");
  if(confirmDelete === "DELETE"){
    localStorage.removeItem("eggySave");
    location.reload();
  }
});

// ================= LOAD =================
window.onload = () => {
  let save = localStorage.getItem("eggySave");
  if(save){
    game = JSON.parse(save);
  }
  updateUI();
  checkAchievements();
};

// ================= UI =================
function updateUI(){
  document.getElementById("points").innerText = Math.floor(game.points);
  document.getElementById("rankDisplay").innerText =
    "Rank: " + tiers[Math.min(game.prestige, tiers.length-1)];
}