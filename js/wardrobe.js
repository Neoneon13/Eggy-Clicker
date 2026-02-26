// =========================
// WARDROBE SYSTEM
// =========================

const wardrobeToggle = document.getElementById("wardrobeToggle");
const wardrobePanel = document.getElementById("wardrobePanel");
const wardrobeList = document.getElementById("wardrobeList");

const forms = ["Normal","Cool","Top Hat","Crown"];
const tiers = ["None","Bronze","Silver","Gold","Diamond","Master"];

const tierUnlockLevel = {
    "None": 0,
    "Bronze": 1,
    "Silver": 2,
    "Gold": 3,
    "Diamond": 4,
    "Master": 5
};

const tierPriceMultiplier = {
    "None": 1,
    "Bronze": 5,
    "Silver": 15,
    "Gold": 40,
    "Diamond": 100,
    "Master": 500
};

if (!game.unlockedSkins) {
    game.unlockedSkins = ["None-Normal"];
}

if (!game.equippedSkin) {
    game.equippedSkin = "None-Normal";
}

wardrobeToggle.addEventListener("click", () => {
    wardrobePanel.classList.toggle("hidden");
    buildWardrobe();
});

function buildWardrobe() {

    wardrobeList.innerHTML = "";

    tiers.forEach(tier => {

        if (game.prestigeLevel < tierUnlockLevel[tier]) {
            return;
        }

        forms.forEach(form => {

            const skinId = tier + "-" + form;
            const owned = game.unlockedSkins.includes(skinId);

            const basePrice = 200;
            const price = basePrice * tierPriceMultiplier[tier];

            const btn = document.createElement("button");

            if (owned) {
                btn.textContent = tier + " " + form + " (Owned)";
            } else {
                btn.textContent = tier + " " + form + " - Cost: " + price;
            }

            if (game.equippedSkin === skinId) {
                btn.style.border = "3px solid lime";
            }

            btn.addEventListener("click", () => {

                if (!owned) {
                    if (game.yolk >= price) {
                        game.yolk -= price;
                        game.unlockedSkins.push(skinId);
                    } else {
                        return;
                    }
                }

                game.equippedSkin = skinId;

                applySkinBonus(tier);
                buildWardrobe();
                updateUI();
            });

            wardrobeList.appendChild(btn);
        });
    });
}

function applySkinBonus(tier) {

    let bonusMultiplier = 1;

    if (tier === "Bronze") bonusMultiplier = 1.2;
    if (tier === "Silver") bonusMultiplier = 1.5;
    if (tier === "Gold") bonusMultiplier = 2;
    if (tier === "Diamond") bonusMultiplier = 3;
    if (tier === "Master") bonusMultiplier = 5;

    game.clickPower = 1 + game.prestigeLevel;
    game.clickPower *= bonusMultiplier;
}