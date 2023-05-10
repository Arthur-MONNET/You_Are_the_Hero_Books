// Récupération de la carte avec l'ID "card"
const card = document.getElementById("card");
const front = document.getElementById("front");
const back = document.getElementById("back");
const circleBackgroundFight = document.getElementById("circle-background-fight");
const fightContainer = document.getElementById("fight-container");

// Définition de la position de départ et de la distance de déplacement
let startY = 0;
let distanceY = 0;
let startX = 0;
let distanceX = 0;

// Fonction pour gérer l'événement "touchstart"
function handleTouchStart(event) {
    startY = event.touches[0].clientY;
    startX = event.touches[0].clientX;
    distanceY = 0;
    distanceX = 0;
}

// Fonction pour gérer l'événement "touchmove"
function handleTouchMove(event) {
    // Empêcher le défilement de la page pendant le mouvement de glissement
    event.preventDefault();

    // Calcul de la distance de déplacement par rapport à la position de départ
    const currentY = event.touches[0].clientY;
    const currentX = event.touches[0].clientX;
    distanceY = currentY - startY;
    distanceX = currentX - startX;

}

// Fonction pour gérer l'événement "touchend"
async function handleTouchEnd(event) {
    // Si la distance de déplacement est supérieure à 50 pixels, déclencher l'action de glissement vers le bas
    if (front.classList.contains("move")) return;
    if (distanceY > 100 || distanceX > 100 || distanceX < -100) {
        front.classList.add("move");
        if(distanceY > 100) await moveDown();
        else if (distanceX > 100) await moveRight();
        else if (distanceX < -100) await moveLeft();
        front.classList.remove("move");
        return
    } else {
        front.classList.add("move");
        if(front.classList.contains("isLeft")) await returnToStartLeft();
        else if (front.classList.contains("isRight")) await returnToStartRight();
        else if (front.classList.contains("isDown")) await returnToStartDown();
        front.classList.remove("move");
    }
}

async function moveDown() {
    if (front.classList.contains("isDown")) {
        front.classList.remove("isDown");
        front.classList.add("end-move-down-front");
        await sleep(300);
        front.classList.remove("end-move-down-front");
        
        await returnCard();
    } else if(front.classList.contains("isLeft")) {
        front.classList.remove("isLeft");
        front.classList.add("isDown");
        front.classList.add("pre-move-down-from-left-front");
        await sleep(300);
        front.classList.remove("pre-move-down-from-left-front");
    } else if (front.classList.contains("isRight")) {
        front.classList.remove("isRight");
        front.classList.add("isDown");
        front.classList.add("pre-move-down-from-right-front");
        await sleep(300);
        front.classList.remove("pre-move-down-from-right-front");
    } else {
        front.classList.add("isDown");
        front.classList.add("pre-move-down-front");
        await sleep(300);
        front.classList.remove("pre-move-down-front");
    }
}

async function moveRight() {
    if (front.classList.contains("isRight")) {
        front.classList.remove("isRight");
        front.classList.add("end-move-right-front");
        await sleep(300);
        front.classList.remove("end-move-right-front");
        
        await returnCard();
    } else if (front.classList.contains("isLeft")) {
        front.classList.remove("isLeft");
        front.classList.add("isRight");
        front.classList.add("pre-move-right-from-left-front");
        await sleep(300);
        front.classList.remove("pre-move-right-from-left-front");
    } else if (front.classList.contains("isDown")) {
        front.classList.remove("isDown");
        front.classList.add("isRight");
        front.classList.add("pre-move-right-from-down-front");
        await sleep(300);
        front.classList.remove("pre-move-right-from-down-front");
    } else {
        front.classList.add("isRight");
        front.classList.add("pre-move-right-front");
        await sleep(300);
        front.classList.remove("pre-move-right-front");
    }
}

async function moveLeft() {
    if (front.classList.contains("isLeft")) {
        front.classList.remove("isLeft");
        front.classList.add("end-move-left-front");
        await sleep(300);
        front.classList.remove("end-move-left-front");
        
        await returnCard();
    } else if(front.classList.contains("isRight")) {
        front.classList.remove("isRight");
        front.classList.add("isLeft");
        front.classList.add("pre-move-left-from-right-front");
        await sleep(300);
        front.classList.remove("pre-move-left-from-right-front");
    } else if (front.classList.contains("isDown")) {
        front.classList.remove("isDown");
        front.classList.add("isLeft");
        front.classList.add("pre-move-left-from-down-front");
        await sleep(300);
        front.classList.remove("pre-move-left-from-down-front");
    } else {
        front.classList.add("isLeft");
        front.classList.add("pre-move-left-front");
        await sleep(300);
        front.classList.remove("pre-move-left-front");
    }
}

async function returnToStartLeft() {
    front.classList.remove("isLeft");
    front.classList.add("return-to-start-from-left-front");
    await sleep(300);
    front.classList.remove("return-to-start-from-left-front");
}

async function returnToStartRight() {
    front.classList.remove("isRight");
    front.classList.add("return-to-start-from-right-front");
    await sleep(300);
    front.classList.remove("return-to-start-from-right-front");
}

async function returnToStartDown() {
    front.classList.remove("isDown");
    front.classList.add("return-to-start-from-down-front");
    await sleep(300);
    front.classList.remove("return-to-start-from-down-front");
}

// Fonction pour faire une pause
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function returnCard() {
    back.classList.add("return-card-animation-back");
    front.classList.add("return-card-animation-front");
    await sleep(500);
    back.classList.remove("return-card-animation-back");
    front.classList.remove("return-card-animation-front");
    fightContainer.classList.remove("hidden");
    circleBackgroundFight.classList.add("fight-open-full-size");
    //circleBackgroundFight.classList.remove("fight-open-full-size");
}

// Ajout des écouteurs d'événements pour "touchstart", "touchmove" et "touchend"
card.addEventListener("touchstart", handleTouchStart);
card.addEventListener("touchmove", handleTouchMove);
card.addEventListener("touchend", handleTouchEnd);