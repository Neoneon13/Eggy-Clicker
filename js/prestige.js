// =============================
// PRESTIGE ENGINE V2 (FINAL)
// =============================

function prestige(){

    if(game.money < 5000){
        notify("Need 5000 Yolk to Prestige!");
        return;
    }

    game.money = 0;
    game.autoPower = 0;
    game.clickPower = 1;
    game.critChance = 0.05;

    game.prestigeLevel++;

    notify("Prestiged to " + getRank(game.prestigeLevel));

    updateUI();
}

// Rank Name Generator
function getRank(level){

    if(level === 0) return "Rank: None";

    if(level === 1) return "Rank: Bronze";
    if(level === 2) return "Rank: Bronze II";

    if(level === 3) return "Rank: Silver";
    if(level === 4) return "Rank: Silver II";

    if(level === 5) return "Rank: Gold";
    if(level === 6) return "Rank: Gold II";

    if(level === 7) return "Rank: Diamond";
    if(level === 8) return "Rank: Diamond II";

    // MASTER 9–18
    if(level >= 9 && level <= 18){
        let stage = level - 8; // 9 → 1
        if(stage === 1) return "Rank: Master";
        return "Rank: Master " + toRoman(stage);
    }

    // ULTIMATE 19+
    if(level >= 19){
        let stage = level - 18; // 19 → 1
        if(stage === 1) return "Rank: Ultimate Master";
        return "Rank: Ultimate Master " + toRoman(stage);
    }
}

// Roman Numerals
function toRoman(num){
    const map = [
        {v:1000,s:"M"},
        {v:900,s:"CM"},
        {v:500,s:"D"},
        {v:400,s:"CD"},
        {v:100,s:"C"},
        {v:90,s:"XC"},
        {v:50,s:"L"},
        {v:40,s:"XL"},
        {v:10,s:"X"},
        {v:9,s:"IX"},
        {v:5,s:"V"},
        {v:4,s:"IV"},
        {v:1,s:"I"}
    ];

    let result = "";

    for(let i=0;i<map.length;i++){
        while(num >= map[i].v){
            result += map[i].s;
            num -= map[i].v;
        }
    }

    return result;
}