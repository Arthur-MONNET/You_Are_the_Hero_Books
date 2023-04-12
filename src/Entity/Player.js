const Quality = require("./Quality");
const Character = require("./Character");
const out = require("../utils/output.js");

class Player extends Character {
    constructor() {
        super("VOUS", 0, new Quality("endurance", "endurance", "🏃"));
        this.agility = new Quality("agility", "agilité", "🏃");
        this.luck = new Quality("luck", "chance", "🍀");
        this.strength = new Quality("strength", "force", "💪");
        this.diplomacy = new Quality("diplomacy", "diplomatie", "🤝");
        this.dexterity = new Quality("dexterity", "adresse", "🤸");
        this.hability = new Quality("hability", "habileté", "🤹");
        this.equitation = new Quality("equitation", "équitation", "🏇");
        
        this.useGun = 0;
        this.belongs_to_military = true;
    }

    getCurrentProperty(property) {
        return this[property].value;
    }

    getInitialProperty(property) {
        return this[property].max;
    }

    setProperty(property, value) {
        this[property].setValue(value);
    }

    setEndurance() {
        this.endurance.setValue(Math.ceil(this.strength.value / 2));
        return this.endurance;
    }

    getQualities() {
        // renvoie un tableau de Quality
        return Object.entries(this.filterProps());
    }

    getQuality(quality) {
        // renvoie une Quality
        return this.filterProps()[quality];
    }

    filterProps() {
        // renvoie seulement les propriétés de l'objet qui sont des Quality
        let qualities = {};
        for (let prop in this) {
            if (this[prop] instanceof Quality) {
                qualities[prop] = this[prop];
            }
        }
        return qualities;
    }

    decrementUseGun() {
        if(this.useGun >= 0) {
            this.useGun--;
        }
    }

    recievedDamage(character) {
        this.endurance.value --;
        this.messageRecievedDamage(character);
    }

    messageTargeted() {
        out.log("white", `Vous attaquez ${this.targeted.name} !`);
    }

    messageLooseAttack() {
        out.logln("dim", `Vous avez raté votre attaque contre ${this.targeted.name}`);
    }

    messageRecievedDamage(character) {
        out.log("red", `Vous avez reçu un coup de ${character.name} !`);
        out.logln("blue", `VOUS : ${this.endurance.value} ❤️`);
    }
}

module.exports = Player;