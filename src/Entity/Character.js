const Dice = require('./Dice.js');
const dice = new Dice();

const out = require('../utils/output.js');

class Character {
    constructor(name, weapon, endurance) {
        this.name = name;
        this.endurance = endurance;
        this.weapon = weapon;
        this.targeted = null;
    }

    async attack() {
        this.messageTargeted();
        const score = await dice.roll();
        if (score <= this.weapon) {
            this.targeted.recievedDamage(this);
            return true;
        }
        this.messageLooseAttack();
        return false;
    }

    recievedDamage(character) {
        this.endurance--;
        this.messageRecievedDamage(character);
    }

    messageTargeted() {
        out.log("white", `${this.name} attaque ${this.targeted.name} !`);
    }

    messageLooseAttack() {
        out.logln("dim", `${this.name} a raté son attaque contre ${this.targeted.name}`);
    }

    messageRecievedDamage(character) {
        out.log("green", `${this.name} a reçu un coup de ${character.name}`);
        if(this.endurance > 0) {
            out.logln("blue", `${this.name} : ${this.endurance} ❤️`);
        }
    }
}

module.exports = Character;