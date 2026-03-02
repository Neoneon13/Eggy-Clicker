// =============================
// WARDROBE ENGINE PRO V2
// =============================

const forms = ["Normal","Cool","Top Hat","Crown"];

const wardrobeTiers = [
    { name:"None", unlock:0, multiplier:1 },
    { name:"Bronze", unlock:1, multiplier:3 },
    { name:"Silver", unlock:3, multiplier:6 },
    { name:"Gold", unlock:5, multiplier:12 },
    { name:"Diamond", unlock:7, multiplier:25 },
    { name:"Master", unlock:9, multiplier:60 },
    { name:"Ultimate", unlock:19, multiplier:150 }
];

// OPEN
function openWardrobe(){
    renderWardrobe();
    document.getElementById("wardrobeModal").style.display="block";
}

function closeWardrobe(){
    document.getElementById("wardrobeModal").style.display="none";
}

// RENDER
function renderWardrobe(){

    const container = document.getElementById("wardrobeItems");
    container.innerHTML = "";

    wardrobeTiers.forEach((tier, tierIndex)=>{

        let header = document.createElement("h3");
        header.innerText = tier.name + " Tier";
        container.appendChild(header);

        forms.forEach((form, formIndex)=>{

            let skinId = tier.name + "-" + form;
            let price = getSkinPrice(tierIndex, formIndex);

            let div = document.createElement("div");
            div.className = "wardrobeItem";

            let owned = game.ownedSkins.includes(skinId);
            let equipped = game.equippedSkin === skinId;
            let locked = game.prestigeLevel < tier.unlock;

            if(equipped){
                div.classList.add("equipped");
            }

            if(locked){
                div.classList.add("locked");
                div.innerText = skinId + " (LOCKED)";
                div.onclick = ()=> notify("Locked until " + tier.name);
            }
            else{
                if(owned){
                    div.innerText = skinId + " (Owned)";
                } else {
                    div.innerText = skinId + " - " + price;
                }

                div.onclick = ()=> handleSkinClick(skinId, price);
            }

            container.appendChild(div);
        });
    });
}

// PRICE SYSTEM
function getSkinPrice(tierIndex, formIndex){

    const basePrices = [1000, 2500, 5000, 10000];

    return basePrices[formIndex] * wardrobeTiers[tierIndex].multiplier;
}

// BUY / EQUIP
function handleSkinClick(skinId, price){

    if(game.ownedSkins.includes(skinId)){
        game.equippedSkin = skinId;
        applySkinBonus();
        renderWardrobe();
        notify("Equipped!");
        return;
    }

    if(game.money < price){
        notify("Not enough Yolk!");
        return;
    }

    game.money -= price;
    game.ownedSkins.push(skinId);
    game.equippedSkin = skinId;

    applySkinBonus();

    renderWardrobe();
    updateUI();
    notify("Purchased!");
}

// BONUS SYSTEM
function applySkinBonus(){

    let tierName = game.equippedSkin.split("-")[0];

    let tier = wardrobeTiers.find(t=>t.name===tierName);

    if(!tier) return;

    game.clickPower = 1 + tier.multiplier;
}