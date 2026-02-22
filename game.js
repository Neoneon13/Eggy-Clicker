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
const achievements=[
{id:"click1",name:"First Click",check:()=>game.totalClicks>=1},
{id:"click100",name:"100 Clicks",check:()=>game.totalClicks>=100},
{id:"click1000",name:"1000 Clicks",check:()=>game.totalClicks>=1000},
{id:"points100",name:"100 Points",check:()=>game.points>=100},
{id:"points1000",name:"1000 Points",check:()=>game.points>=1000},
{id:"prest1",name:"First Prestige",check:()=>game.prestige>=1}
];

function buildAchievements(){
let list=document.getElementById("achievementList");
list.innerHTML="";
achievements.forEach(a=>{
let div=document.createElement("div");
div.className="achievement locked";
div.id="ach-"+a.id;
div.innerText=a.name;
list.appendChild(div);
});
}

function checkAchievements(){
achievements.forEach(a=>{
if(!game.achievements.includes(a.id)&&a.check()){
game.achievements.push(a.id);
let div=document.getElementById("ach-"+a.id);
div.classList.remove("locked");
div.classList.add("unlocked");
}
});
}

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