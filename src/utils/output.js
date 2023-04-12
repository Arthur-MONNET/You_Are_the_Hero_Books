class Output {
    constructor() {
        this.colors = {
            red: 31,
            green: 32,
            yellow: 33,
            blue: 34,
            magenta: 35,
            cyan: 36,
            white: 37,
            reset: 0,
            dim: 2,
            underline: 4
        };
        this.ln = '\n';
        this.paragraphSize = 80;
    }
    l(codeColor, text, endColor = "\x1b[" + this.colors.reset + "m") {
        console.log(codeColor, text, endColor);
    }
    log(color, text) {
        if (typeof color === "string") {
            this.l("\x1b[" + this.colors[color] + "m", text);
        } else if (typeof color === "number") {
            this.l("\x1b[" + color + "m", text);
        } else if (Array.isArray(color)) {
            let codeColor = "\x1b[";
            for (let i = 0; i < color.length; i++) {
                codeColor += this.colors[color[i]] + ";";
            }
            codeColor = codeColor.slice(0, -1);
            codeColor += "m";
            this.l(codeColor, text);
        }
    }
    space(nbLine = 1) {
        for (let i = 0; i < nbLine; i++) {
            this.log("white", "");
        }
    }

    divider(size = this.paragraphSize + 4) {
        let line = "";
        for (let i = 0; i < size; i++) line += "_";
        this.log("dim", ' ' + line)
    }

    splitText(text) {
        let splitText = [];
        let line = "";
        let words = text.split(" ");
        words.forEach(word => {
            if (line.length + word.length < this.paragraphSize) {
                line += word + " ";
            } else {
                splitText.push(line);
                line = word + " ";
            }
        });
        splitText.push(line);
        return splitText;
    }

    drawParagraph(paragraph) {
        const text = paragraph.text;
        let underScore = "", space = "";
        for (let i = 0; i < this.paragraphSize + 4; i++) underScore += "_", space += " ";
        this.log("white", ' ' + underScore)
        this.log("white", '|' + space + '|');
        let splitText = text.split("\n");
        splitText.forEach(line => {
            if (line.length === 0) {
                this.log("white", '|  ' + space + '  |');
            } else {
                let splitLine = this.splitText(line);
                splitLine.forEach(subline => {
                    let endLineSpace = "";
                    for (let i = 0; i < this.paragraphSize - subline.length; i++) endLineSpace += " ";
                    this.log("white", '|  ' + subline + endLineSpace + '  |');
                });
            }
        });
        this.log("white", '|' + underScore + '|');
    }

    drawChoices(question, choices) {
        this.logln("white", this.ln + question);
        choices.forEach((choice, index) => {
            this.logln("yellow", (index + 1) + "- " + choice.rep);
        });
    }

    drawCharacter(character, i = "") {
        this.log("blue", (i ? i + ": " : "") + character.name + " [ ⚔️  : " + character.weapon + " | ❤️  : " + (typeof character.endurance === "object" ? character.endurance.value : character.endurance) + " ]");
    }

    drawCharacters(characters) {
        characters.forEach((character, index) => {
            this.drawCharacter(character, index + 1);
        });
    }

    listFighters(enemies, attacker) {
        this.space(2);
        if (enemies.length === 1) {
            this.drawCharacter(enemies[0]);
        } else {
            this.drawCharacters(enemies);
        }
        this.divider(5);
        this.space();
        this.drawCharacter(attacker);
        this.space();
    }

    logln(color, text) {
        this.log(color, text + this.ln);
    }
    error(text) {
        this.logln("red", text);
    }
    displayQualityScore(quality) {
        this.logln("green", "La valeur de votre " + quality.fr + " est : " + quality.value);
    }
    displayQualityIcon(quality) {
        this.logln("white", this.ln + this.ln + " " + quality.icon + " " + quality.fr.toUpperCase() + " " + quality.icon);
    }

    characterDeath(character) {
        this.space();
        this.logln("dim", `☠️ --- ${character.name} est mort ! --- ☠️`);
    }

    addSpaces(prop, score) {
        let es1 = "", es2 = "";
        for (let i = 0; i < Math.trunc(prop.length / 2 - ((score > 9) ? 1 : 0.5)); i++) {
            es1 += " ";
        }
        for (let i = 0; i < Math.ceil(prop.length / 2 - ((score > 9) ? 1 : 0.5)); i++) {
            es2 += " ";
        }
        return es1 + score + es2;
    }
    displayScoresTable(player) {
        let lineProp = ' props |',
            lineValue = 'values |',
            mdLine = '|---:|',
            underScore = "         ";
        for (let [id, quality] of player.getQualities()) {
            lineProp += ` ${quality.fr} |`;
            lineValue += ` ${this.addSpaces(quality.fr, quality.value)} |`;
            mdLine += ':---:|';
        }
        for (let i = 0; i < lineProp.length - 9; i++) {
            underScore += "_";
        }
        this.log("magenta", this.ln + underScore);
        this.log(["magenta", "underline"], lineProp + this.ln + " " + lineValue);

        return "|" + lineProp + "\n" + mdLine + "\n|" + lineValue;
    }

    death() {
        this.space(2);
        this.log("red", `       888                888   888      
        888                888   888      
        888                888   888      
    .d88888 .d88b.  8888b. 88888888888b.  
   d88" 888d8P  Y8b    "88b888   888 "88b 
   888  88888888888.d888888888   888  888 
   Y88b 888Y8b.    888  888Y88b. 888  888 
    "Y88888 "Y8888 "Y888888 "Y888888  888 `)
    }
    win() {
        this.space(2);
        this.log("green", `        /$$$$$$$$ /$$   /$$ /$$$$$$$$       /$$$$$$$$ /$$   /$$ /$$$$$$$        /$$
        |__  $$__/| $$  | $$| $$_____/      | $$_____/| $$$ | $$| $$__  $$      | $$
           | $$   | $$  | $$| $$            | $$      | $$$$| $$| $$    $$      | $$
           | $$   | $$$$$$$$| $$$$$         | $$$$$   | $$ $$ $$| $$  | $$      | $$
           | $$   | $$__  $$| $$__/         | $$__/   | $$  $$$$| $$  | $$      |__/
           | $$   | $$  | $$| $$            | $$      | $$   $$$| $$  | $$          
           | $$   | $$  | $$| $$$$$$$$      | $$$$$$$$| $$    $$| $$$$$$$/       /$$
           |__/   |__/  |__/|________/      |________/|__/   __/|_______/       |__/`)
    }
}

module.exports = new Output();