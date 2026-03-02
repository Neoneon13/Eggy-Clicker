// =============================
// EVENT SYSTEM PRO V1
// =============================

let activeEvent = null;
let eventTimer = 0;

// EVENT LIST
const eventPool = [

{
    name: "Golden Egg Frenzy",
    duration: 30,
    start: () => {
        game.clickMultiplier = 5;
        notify("Golden Egg Frenzy! 5x Clicks!");
    },
    end: () => {
        game.clickMultiplier = 1;
        notify("Golden Frenzy Ended");
    }
},

{
    name: "Auto Surge",
    duration: 30,
    start: () => {
        game.autoMultiplier = 3;
        notify("Auto Surge! 3x CPS!");
    },
    end: () => {
        game.autoMultiplier = 1;
        notify("Auto Surge Ended");
    }
},

{
    name: "Critical Storm",
    duration: 25,
    start: () => {
        game.critChance += 0.15;
        notify("Critical Storm! +15% Crit Chance!");
    },
    end: () => {
        game.critChance -= 0.15;
        notify("Critical Storm Ended");
    }
}

];

// START RANDOM EVENT
function triggerRandomEvent(){

    if(activeEvent) return;

    let random = eventPool[Math.floor(Math.random() * eventPool.length)];

    activeEvent = random;
    eventTimer = random.duration;

    random.start();
}

// UPDATE LOOP
function updateEventSystem(){

    if(activeEvent){

        eventTimer--;

        if(eventTimer <= 0){
            activeEvent.end();
            activeEvent = null;
        }

    } else {

        // 1% chance per second
        if(Math.random() < 0.01){
            triggerRandomEvent();
        }

    }

}

// MANUAL BUTTON
function forceEvent(){
    triggerRandomEvent();
}