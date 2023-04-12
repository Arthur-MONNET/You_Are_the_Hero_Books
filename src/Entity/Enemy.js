const Character = require('./Character');

class Enemy extends Character {
    constructor(name, weapon, endurance, targeted) {
        super(name, weapon, endurance);
        this.targeted = targeted;
    }
}

module.exports = Enemy;