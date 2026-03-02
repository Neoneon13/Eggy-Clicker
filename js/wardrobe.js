// wardrobe.js – Clean Locked Tier System

const forms = ["Normal", "Cool", "Top Hat", "Crown"];

const tiers = [
    { name: "None", unlock: 0, multiplier: 1 },
    { name: "Bronze", unlock: 1, multiplier: 3 },
    { name: "Silver", unlock: 3, multiplier: 6 },
    { name: "Gold", unlock: 5, multiplier: 12 },
    { name: "Diamond", unlock: 7, multiplier: 25 },
    { name: "Master", unlock: 9, multiplier: 60 },
    { name: "Ultimate", unlock: 19, multiplier: 150 }
];

function getPrice(tierIndex, formIndex) {
    const base = [1000, 2500, 5000, 10000];
    return base[formIndex] * tiers[tierIndex].multiplier;
}

function openWardrobe() {
    const container = document.getElementById("wardrobeItems");
    container.innerHTML = "";

    tiers.forEach((tier, tIndex) => {
        const tierHeader = document.createElement("h3");
        tierHeader.textContent = tier.name + " Tier";
        container.appendChild(tierHeader);

        forms.forEach((form, fIndex) => {
            const item = document.createElement("div");
            item.className = "wardrobeItem";

            const owned = game.ownedSkins.includes(tier.name + "-" + form);
            const equipped = game.equippedSkin === tier.name + "-" + form;

            const price = getPrice(tIndex, fIndex);

            item.innerHTML = `
                <strong>${tier.name} ${form}</strong><br>
                ${owned ? "Owned" : "Price: " + price}
            `;

            if (equipped) {
                item.style.border = "3px solid green";
            }

            if (game.prestigeLevel < tier.unlock) {
                item.style.opacity = "0.4";
                item.onclick = () => alert("LOCKED");
            } else {
                item.onclick = () => handleSkinClick(tIndex, fIndex);
            }

            container.appendChild(item);
        });
    });

    document.getElementById("wardrobeModal").style.display = "block";
}

function handleSkinClick(tIndex, fIndex) {
    const tier = tiers[tIndex];
    const form = forms[fIndex];
    const id = tier.name + "-" + form;
    const price = getPrice(tIndex, fIndex);

    if (game.ownedSkins.includes(id)) {
        game.equippedSkin = id;
        saveGame();
        openWardrobe();
        return;
    }

    if (game.money >= price) {
        game.money -= price;
        game.ownedSkins.push(id);
        game.equippedSkin = id;
        saveGame();
        openWardrobe();
    } else {
        alert("Not enough coins");
    }
}