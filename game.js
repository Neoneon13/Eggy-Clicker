// ===============================
// 🥚 EGGY CLICKER SAFE ENGINE
// ===============================

alert("JS IS LOADING");

window.addEventListener("DOMContentLoaded", () => {

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

let game = {
  username:"",
  points:0,
  clickValue:1,
  autoValue:0,
  critChance:0.05,
  prestige:0,
  equipped:"0-0",
  owned:{"0-0":true}
};

const loginScreen = document.getElementById("loginScreen");
const gameScreen = document.getElementById("gameScreen");
const usernameInput = document.getElementById("usernameInput");
const playerName = document.getElementById("playerName");
const egg = document.getElementById("egg");

window.startGame = function(){
  const name = usernameInput.value.trim();
  if(!name) return alert("Enter username");

  game.username = name;
  playerName.innerText = name;

  loginScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  updateUI();
};

window.prestige = function(){
  if(game.points < 10000) return alert("Need 10000");

  game.points = 0;
  game.clickValue = 1;
  game.autoValue = 0;
  game.critChance = 0.05;
  game.prestige++;

  updateUI();
};

window.toggleWardrobe = function(){
  document.getElementById("wardrobePanel")
    .classList.toggle("hidden");
};

window.goToEvent = function(){
  window.location.href = "event.html";
};

function updateUI(){
  document.getElementById("points").innerText =
    Math.floor(game.points);

  document.getElementById("rankDisplay").innerText =
    TIERS[game.prestige] || "Legend";

  document.getElementById("prestigeBtn").innerText =
    "Prestige (10000)";
}

egg.addEventListener("click",()=>{
  let value = game.clickValue;

  if(Math.random() < game.critChance){
    value *= 3;
  }

  game.points += value;
  updateUI();
});

});