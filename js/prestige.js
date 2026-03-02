// prestige.js – V2 Clean Infinite Prestige System

function getPrestigeName(level) {

    if (level === 0) return "None";

    // Bronze
    if (level === 1) return "Bronze";
    if (level === 2) return "Bronze II";

    // Silver
    if (level === 3) return "Silver";
    if (level === 4) return "Silver II";

    // Gold
    if (level === 5) return "Gold";
    if (level === 6) return "Gold II";

    // Diamond
    if (level === 7) return "Diamond";
    if (level === 8) return "Diamond II";

    // Master (9–18)
    if (level >= 9 && level <= 18) {
        const stage = level - 8; // 9 -> 1, 18 -> 10
        if (stage === 1) return "Master";
        return "Master " + toRoman(stage);
    }

    // Ultimate Master (19+)
    if (level >= 19) {
        const stage = level - 18; // 19 -> 1
        if (stage === 1) return "Ultimate Master";
        return "Ultimate Master " + toRoman(stage);
    }
}

// Roman numeral converter
function toRoman(num) {
    const map = [
        { value: 1000, symbol: "M" },
        { value: 900, symbol: "CM" },
        { value: 500, symbol: "D" },
        { value: 400, symbol: "CD" },
        { value: 100, symbol: "C" },
        { value: 90, symbol: "XC" },
        { value: 50, symbol: "L" },
        { value: 40, symbol: "XL" },
        { value: 10, symbol: "X" },
        { value: 9, symbol: "IX" },
        { value: 5, symbol: "V" },
        { value: 4, symbol: "IV" },
        { value: 1, symbol: "I" }
    ];

    let result = "";

    for (let i = 0; i < map.length; i++) {
        while (num >= map[i].value) {
            result += map[i].symbol;
            num -= map[i].value;
        }
    }

    return result;
}