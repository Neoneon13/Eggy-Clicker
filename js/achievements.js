// =============================
// ACHIEVEMENTS ENGINE PRO V2
// =============================

const achievementData = [

/* CLICK ACHIEVEMENTS */
{ id:1,  name:"First Tap",              desc:"Click once",                 check:()=>game.totalClicks>=1 },
{ id:2,  name:"Getting Warm",           desc:"100 clicks",                 check:()=>game.totalClicks>=100 },
{ id:3,  name:"Click Machine",          desc:"1,000 clicks",               check:()=>game.totalClicks>=1000 },
{ id:4,  name:"Finger Destroyer",       desc:"10,000 clicks",              check:()=>game.totalClicks>=10000 },
{ id:5,  name:"Egg Obliterator",        desc:"100,000 clicks",             check:()=>game.totalClicks>=100000 },

/* CPS ACHIEVEMENTS */
{ id:6,  name:"Automation Begins",      desc:"1 CPS",                      check:()=>game.autoPower>=1 },
{ id:7,  name:"Factory Online",         desc:"10 CPS",                     check:()=>game.autoPower>=10 },
{ id:8,  name:"Industrial Egg",         desc:"50 CPS",                     check:()=>game.autoPower>=50 },
{ id:9,  name:"Yolk Empire",            desc:"100 CPS",                    check:()=>game.autoPower>=100 },

/* PRESTIGE ACHIEVEMENTS */
{ id:10, name:"Reborn",                 desc:"Prestige once",              check:()=>game.prestigeLevel>=1 },
{ id:11, name:"Silver Status",          desc:"Reach Silver",               check:()=>game.prestigeLevel>=3 },
{ id:12, name:"Golden Power",           desc:"Reach Gold",                 check:()=>game.prestigeLevel>=5 },
{ id:13, name:"Diamond Authority",      desc:"Reach Diamond",              check:()=>game.prestigeLevel>=7 },
{ id:14, name:"Master Mind",            desc:"Reach Master",               check:()=>game.prestigeLevel>=9 },
{ id:15, name:"Ultimate Being",         desc:"Reach Ultimate Master",      check:()=>game.prestigeLevel>=19 },

/* MONEY ACHIEVEMENTS */
{ id:16, name:"Small Fortune",          desc:"10,000 Yolk",                check:()=>game.money>=10000 },
{ id:17, name:"Wealthy",                desc:"100,000 Yolk",               check:()=>game.money>=100000 },
{ id:18, name:"Millionaire Egg",        desc:"1,000,000 Yolk",             check:()=>game.money>=1000000 },

/* CRIT ACHIEVEMENTS */
{ id:19, name:"Lucky Crack",            desc:"10% Crit Chance",            check:()=>game.critChance>=0.10 },
{ id:20, name:"Critical Master",        desc:"25% Crit Chance",            check:()=>game.critChance>=0.25 },

/* SKIN ACHIEVEMENTS */
{ id:21, name:"New Look",               desc:"Buy 1 skin",                 check:()=>game.ownedSkins.length>=2 },
{ id:22, name:"Fashion Egg",            desc:"Buy 5 skins",                check:()=>game.ownedSkins.length>=6 },
{ id:23, name:"Wardrobe King",          desc:"Buy 15 skins",               check:()=>game.ownedSkins.length>=16 },

/* PRESTIGE LADDER */
{ id:24, name:"Master X",               desc:"Reach Master X",             check:()=>game.prestigeLevel>=18 },
{ id:25, name:"Ultimate II",            desc:"Reach Ultimate II",          check:()=>game.prestigeLevel>=20 },
{ id:26, name:"Ultimate V",             desc:"Reach Ultimate V",           check:()=>game.prestigeLevel>=23 },

/* TOTAL PROGRESSION */
{ id:27, name:"Half Million Clicks",    desc:"500,000 clicks",             check:()=>game.totalClicks>=500000 },
{ id:28, name:"Ten Prestiges",          desc:"Prestige 10 times",          check:()=>game.prestigeLevel>=10 },
{ id:29, name:"Twenty Prestiges",       desc:"Prestige 20 times",          check:()=>game.prestigeLevel>=20 },
{ id:30, name:"Egg Legend",             desc:"Reach 1,000,000 Yolk + Master", check:()=>game.money>=1000000 && game.prestigeLevel>=9 }

];


// =============================
// CHECK SYSTEM
// =============================

function checkAchievements(){

    achievementData.forEach(a=>{

        if(!game.achievements.includes(a.id) && a.check()){
            game.achievements.push(a.id);
            notify("Achievement: " + a.name);
            renderAchievements();
        }

    });
}


// =============================
// RENDER
// =============================

function renderAchievements(){

    const container = document.getElementById("achievementList");
    container.innerHTML = "";

    achievementData.forEach(a=>{

        let div = document.createElement("div");
        div.className = "wardrobeItem";

        if(game.achievements.includes(a.id)){
            div.innerHTML = "✔ <strong>" + a.name + "</strong><br>" + a.desc;
        } else {
            div.innerHTML = "???<br>Locked Achievement";
            div.classList.add("locked");
        }

        container.appendChild(div);

    });
}