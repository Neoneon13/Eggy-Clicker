<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Eggy Clicker</title>
<style>
body{
  margin:0;
  font-family:Arial;
  background:linear-gradient(135deg,#1a1a1a,#000);
  color:white;
  text-align:center;
}

button{
  padding:10px 15px;
  margin:5px;
  border:none;
  border-radius:8px;
  cursor:pointer;
  font-weight:bold;
}

#egg{
  font-size:90px;
  cursor:pointer;
  margin:20px;
}

.panel{
  margin:15px;
  padding:10px;
  background:#222;
  border-radius:10px;
}

.achievement{
  background:#333;
  margin:5px;
  padding:5px;
  border-radius:6px;
}

.locked{
  opacity:0.4;
}

.unlocked{
  background:gold;
  color:black;
}

#loginScreen{
  margin-top:100px;
}
</style>
</head>
<body>

<div id="loginScreen">
  <h1>🥚 Eggy Clicker</h1>
  <input id="usernameInput" placeholder="Username">
  <button onclick="startGame()">Start</button>
  <button onclick="loadGame()">Load</button>
</div>

<div id="gameScreen" style="display:none;">

<h2 id="playerName"></h2>

<h1 id="points">0</h1>
<div id="cpsDisplay">CPS: 0</div>

<div id="egg">🥚</div>

<button onclick="prestige()">Prestige</button>
<button onclick="toggleWardrobe()">Wardrobe</button>
<button onclick="saveGame()">Save</button>
<button onclick="exportGame()">Export</button>
<button onclick="importGame()">Import</button>
<button onclick="deleteGame()">Delete</button>

<div class="panel">
<h3>Shop</h3>
<button id="clickUpgrade"></button>
<button id="autoUpgrade"></button>
<button id="critUpgrade"></button>
</div>

<div class="panel" id="wardrobePanel" style="display:none;"></div>

<div class="panel">
<h3>Achievements</h3>
<div id="achievementList"></div>
</div>

</div>

<script>

// ================= STATE =================
let game={
username:"",
points:0,
clickValue:1,
autoValue:0,
critChance:0.05,
prestige:0,
ownedSkins:["0-0"],
form:0,
achievements:[],
totalClicks:0
};

let clickTimes=[];

// ================= START =================
function startGame(){
let name=document.getElementById("usernameInput").value.trim();
if(!name){alert("Enter username");return;}
game.username=name;
document.getElementById("playerName").innerText="Player: "+name;
document.getElementById("loginScreen").style.display="none";
document.getElementById("gameScreen").style.display="block";
init();
}

function init(){
setupShop();
buildAchievements();
updateUI();
}

// ================= CLICK =================
document.getElementById("egg").onclick=function(){

let value=game.clickValue*(1+game.prestige*0.1);

if(Math.random()<game.critChance){
value*=3;
}

game.points+=Math.floor(value);
game.totalClicks++;

clickTimes.push(Date.now());
updateUI();
checkAchievements();
};

// ================= CPS =================
setInterval(()=>{
let now=Date.now();
clickTimes=clickTimes.filter(t=>now-t<1000);
document.getElementById("cpsDisplay").innerText="CPS: "+clickTimes.length;
},200);

// ================= AUTO =================
setInterval(()=>{
game.points+=game.autoValue;
updateUI();
},1000);

// ================= SHOP =================
function setupShop(){

let clickBtn=document.getElementById("clickUpgrade");
let autoBtn=document.getElementById("autoUpgrade");
let critBtn=document.getElementById("critUpgrade");

clickBtn.innerText="Upgrade Click (+1) - 50";
autoBtn.innerText="Auto Clicker (+1/sec) - 200";
critBtn.innerText="Crit Chance (+1%) - 500";

clickBtn.onclick=function(){
if(game.points>=50){
game.points-=50;
game.clickValue++;
updateUI();
}
};

autoBtn.onclick=function(){
if(game.points>=200){
game.points-=200;
game.autoValue++;
updateUI();
}
};

critBtn.onclick=function(){
if(game.points>=500){
game.points-=500;
game.critChance+=0.01;
updateUI();
}
};
}

// ================= PRESTIGE =================
function prestige(){
let cost=10000*(game.prestige+1);
if(game.points<cost){alert("Need "+cost);return;}
game.prestige++;
game.points=0;
game.clickValue=1;
game.autoValue=0;
game.critChance=0.05;
updateUI();
}

// ================= WARDROBE =================
function toggleWardrobe(){
let panel=document.getElementById("wardrobePanel");
panel.style.display=panel.style.display==="none"?"block":"none";
}

// ================= ACHIEVEMENTS =================

const achievements = [

{ id:"c1", name:"First Crack", check:()=>game.totalClicks>=1 },
{ id:"c50", name:"Shell Tapper", check:()=>game.totalClicks>=50 },
{ id:"c100", name:"Egg Breaker", check:()=>game.totalClicks>=100 },
{ id:"c500", name:"Yolk Puncher", check:()=>game.totalClicks>=500 },
{ id:"c1000", name:"Shell Destroyer", check:()=>game.totalClicks>=1000 },
{ id:"c5000", name:"Egg Obliterator", check:()=>game.totalClicks>=5000 },

{ id:"p100", name:"100 Yolk", check:()=>game.points>=100 },
{ id:"p1000", name:"1k Yolk", check:()=>game.points>=1000 },
{ id:"p10000", name:"10k Yolk", check:()=>game.points>=10000 },
{ id:"p100000", name:"100k Yolk", check:()=>game.points>=100000 },

{ id:"auto10", name:"Auto x10", check:()=>game.autoValue>=10 },
{ id:"auto50", name:"Auto x50", check:()=>game.autoValue>=50 },

{ id:"crit10", name:"10% Crit", check:()=>game.critChance>=0.10 },
{ id:"crit25", name:"25% Crit", check:()=>game.critChance>=0.25 },

{ id:"prest1", name:"Bronze I", check:()=>game.prestige>=1 },
{ id:"prest2", name:"Bronze II", check:()=>game.prestige>=2 },
{ id:"prest3", name:"Silver I", check:()=>game.prestige>=3 },
{ id:"prest4", name:"Silver II", check:()=>game.prestige>=4 },
{ id:"prest5", name:"Gold I", check:()=>game.prestige>=5 },
{ id:"prest6", name:"Gold II", check:()=>game.prestige>=6 },
{ id:"prest7", name:"Diamond I", check:()=>game.prestige>=7 },
{ id:"prest8", name:"Master I", check:()=>game.prestige>=8 }

];

// ================= SAVE =================
function saveGame(){
localStorage.setItem("eggySave",JSON.stringify(game));
}

function loadGame(){
let data=localStorage.getItem("eggySave");
if(!data){alert("No save");return;}
game=JSON.parse(data);
document.getElementById("playerName").innerText="Player: "+game.username;
document.getElementById("loginScreen").style.display="none";
document.getElementById("gameScreen").style.display="block";
init();
}

function exportGame(){
prompt("Copy this:",btoa(JSON.stringify(game)));
}

function importGame(){
let data=prompt("Paste save:");
if(!data)return;
game=JSON.parse(atob(data));
init();
}

function deleteGame(){
localStorage.removeItem("eggySave");
location.reload();
}

// ================= UI =================
function updateUI(){
document.getElementById("points").innerText=Math.floor(game.points);
}

</script>

</body>
</html>