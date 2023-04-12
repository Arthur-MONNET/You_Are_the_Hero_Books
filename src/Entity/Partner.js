const Character = require('./Character');
const out = require('../utils/output.js');

class Partner extends Character {
    constructor(name, weapon, endurance, targeted) {
        super(name, weapon, endurance);
        this.targeted = targeted;
    }

    messageRecievedDamage(character) {
        out.log("red", `${this.name} a reçu un coup de ${character.name}`);
        if(this.endurance > 0) {
            out.logln("blue", `${this.name} : ${this.endurance} ❤️`);
        }
    }
}

module.exports = Partner;