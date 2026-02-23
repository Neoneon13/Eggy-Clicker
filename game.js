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

const forms=["Normal","Cool","Top Hat","Crown"];
const tiers=["None","Bronze I","Bronze II","Silver I","Silver II","Gold I","Gold II","Diamond I","Master I"];

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

let tierBonus=1+(game.prestige*0.2);
value*=tierBonus;

if(forms[game.form]==="Cool") value*=1.2;
if(forms[game.form]==="Top Hat") value*=1.4;
if(forms[game.form]==="Crown") value*=1.7;

if(Math.random()<game.critChance) value*=3;

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
document.getElementById("cps").innerText=clickTimes.length;
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
let bgBtn=document.getElementById("bgUpgrade");

clickBtn.innerText="Upgrade Click (+1) - 50";
autoBtn.innerText="Auto Clicker (+1/sec) - 200";
critBtn.innerText="Crit Chance (+1%) - 500";
bgBtn.innerText="Change Background - 100";

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

bgBtn.onclick=function(){
if(game.points>=100){
game.points-=100;
document.body.style.background="linear-gradient(135deg,#"+Math.floor(Math.random()*999999)+",#000)";
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
buildWardrobe();
}

function buildWardrobe(){
let panel=document.getElementById("wardrobePanel");
panel.innerHTML="";

for(let t=0;t<tiers.length;t++){
if(t>game.prestige) continue;

for(let f=0;f<forms.length;f++){

let id=t+"-"+f;
let owned=game.ownedSkins.includes(id);
let price=(100*(f+1))*(t+1)*5;

let btn=document.createElement("button");
btn.innerText=tiers[t]+" "+forms[f]+(owned?" (Owned)":" - "+price);

if(game.form===f && owned){
btn.style.border="3px solid lime";
}

btn.onclick=function(){
if(!owned){
if(game.points<price)return;
game.points-=price;
game.ownedSkins.push(id);
}
game.form=f;
updateUI();
buildWardrobe();
};

panel.appendChild(btn);
}
}
}

// ================= ACHIEVEMENTS =================
const achievements=[
{id:"c1",name:"First Crack",check:()=>game.totalClicks>=1},
{id:"c100",name:"Egg Breaker",check:()=>game.totalClicks>=100},
{id:"c1000",name:"Shell Destroyer",check:()=>game.totalClicks>=1000},
{id:"prest1",name:"Bronze I",check:()=>game.prestige>=1},
{id:"prest5",name:"Gold I",check:()=>game.prestige>=5}
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
div.style.background="gold";
div.style.color="black";
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
document.getElementById("rankDisplay").innerText="Rank: "+tiers[Math.min(game.prestige,tiers.length-1)];
document.getElementById("prestigeBtn").innerText="Prestige ("+(10000*(game.prestige+1))+")";
}