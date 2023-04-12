const input = require("../utils/input.js");
const out = require("../utils/output.js");

class Dice {
    constructor() {
        this.diceDesign = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
        this.nb1 = 0;
        this.nb2 = 0;
        this.total = 0;
    }

    async roll(cheated = false) {
        try {
            await this.askToRoll();
            if(cheated) {
                this.cheatedCalculate();
            } else {
                this.calculate();
            }
            this.displayResult();
            return this.total;
        } catch (error) {
            out.error(error);
            return error;
        }
    }
    
    async askToRoll() {
        try {
            const response = await input.getSpecificKey(
                "",
                "Pressez ENTREE pour lancer les dés 🎲... ",
                "Oups mauvais bouton !"
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    calculate() {
        this.nb1 = Math.trunc(Math.random() * 6) + 1;
        this.nb2 = Math.trunc((Math.random() * 6)) + 1
        this.total = this.nb1 + this.nb2;
    }
    
    cheatedCalculate() {
        this.nb1 = Math.trunc(Math.random() * 6) + 1;
        this.nb2 = Math.trunc((Math.random() * this.nb1) + 7 - this.nb1)
        this.total = this.nb1 + this.nb2;
    }

    displayResult() {
        out.logln("white", this.nb1 + " " + this.diceDesign[this.nb1] + " " + this.nb2 + " " + this.diceDesign[this.nb2]);
    }
}

module.exports = Dice;