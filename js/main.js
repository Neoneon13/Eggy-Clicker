let game={
username:"",
money:0,
clickPower:1,
autoPower:0,
critChance:0.05,
prestigeLevel:0,
ownedSkins:["None-Normal"],
equippedSkin:"None-Normal",
achievements:[],
totalClicks:0,
useEmoji:true
};

let clickTimes=[];

// START
function startGame(){
let name=document.getElementById("usernameInput").value.trim();
if(!name){alert("Enter username");return;}
game.username=name;
enterGame();
}

function enterGame(){
document.getElementById("playerName").innerText="Player: "+game.username;
document.getElementById("loginScreen").style.display="none";
document.getElementById("gameScreen").style.display="block";
updateUI();
renderAchievements();
}

function updateUI(){
document.getElementById("points").innerText=Math.floor(game.money);
document.getElementById("rankDisplay").innerText=getRank(game.prestigeLevel);
document.getElementById("clickUpgrade").innerText="Click +" + game.clickPower + " (50)";
document.getElementById("autoUpgrade").innerText="Auto +" + game.autoPower + " (200)";
document.getElementById("critUpgrade").innerText="Crit " + Math.floor(game.critChance*100) + "% (500)";
document.getElementById("bgUpgrade").innerText="Change Background (100)";
}

// CLICK
document.addEventListener("click",function(e){
if(e.target.id==="egg"){
let value=game.clickPower;

if(Math.random()<game.critChance){
value*=3;
notify("CRIT!");
}

game.money+=value;
game.totalClicks++;
clickTimes.push(Date.now());
spawnFloat(value,e.clientX,e.clientY);
updateUI();
checkAchievements();
}
});

function spawnFloat(val,x,y){
let div=document.createElement("div");
div.innerText="+"+val;
div.style.position="fixed";
div.style.left=x+"px";
div.style.top=y+"px";
div.style.color="orange";
div.style.fontWeight="bold";
document.body.appendChild(div);
setTimeout(()=>div.remove(),800);
}

// CPS
setInterval(()=>{
clickTimes=clickTimes.filter(t=>Date.now()-t<1000);
document.getElementById("cps").innerText=clickTimes.length;
},200);

// AUTO
setInterval(()=>{
game.money+=game.autoPower;
updateUI();
},1000);

// SAVE
function saveGame(){
localStorage.setItem("eggySave",JSON.stringify(game));
notify("Saved!");
}

function loadGame(){
let data=localStorage.getItem("eggySave");
if(!data)return alert("No Save");
game=JSON.parse(data);
enterGame();
}

function exportGame(){
prompt("Copy:",btoa(JSON.stringify(game)));
}

function importGame(){
let data=prompt("Paste:");
if(!data)return;
game=JSON.parse(atob(data));
enterGame();
}

function deleteGame(){
if(prompt("Type DELETE")==="DELETE"){
localStorage.removeItem("eggySave");
location.reload();
}
}

function toggleEggMode(){
game.useEmoji=!game.useEmoji;
document.getElementById("egg").innerText=game.useEmoji?"🥚":"EGG";
}

function notify(msg){
let n=document.getElementById("notification");
n.innerText=msg;
n.style.display="block";
setTimeout(()=>n.style.display="none",1500);
}