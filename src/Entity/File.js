const fs = require('fs');

class File {
    constructor(path) {
        this.path = path;
        this.create();
    }
    create() {
        fs.writeFile(this.path, '', (err) => {
            if (err) {
                throw err;
            }
        });
    }
    add(text) {
        return new Promise((resolve, reject) => {
            fs.appendFile(this.path, text, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    async divider() {
        return new Promise((resolve, reject) => {
            try {
                this.add("\n---\n");
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    async addTitle(title, level = 1) {
        return new Promise((resolve, reject) => {
            try {
                this.add("\n" + "#".repeat(level) + " " + title + "\n");
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    async addImage(name) {
        const picture = name + ".png";
        if (fs.existsSync("assets/" + picture)) {
            return new Promise((resolve, reject) => {
                try {
                    this.add("![image](assets/" + picture + ")\n\n");
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }

    async addPage(name, page) {
        await this.addTitle(name, 2);
        await this.addImage(name);
        await this.add("\t" + page.text.replaceAll("\n", "\n\t") + "\n");
    }

    async addQuestion(question, choices) {
        await this.add("\n" + question + "\n")
        for (let choice of choices) {
            await this.add("- " + choice.rep + "\n")
        };

    }

    async addChoice(choice) {
        return new Promise((resolve, reject) => {
            try {
                this.add("\n-> " + choice.rep + "\n");
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    async listFighters(enemies, player, partner, partnerEnemies) {
        await this.divider();
        await this.add("\nCombattants :\n\n");
        let allEnemies = [...enemies];
        if(partnerEnemies) allEnemies.push(...partnerEnemies);
        let lineTable = "|--:|";
        for(let i = 0; i < allEnemies.length; i++) {
            lineTable += ":--:|";
        }
        await this.add("Ennemis : |" + allEnemies.map(enemy => enemy.name).join(" | ") + " |\n");
        await this.add(lineTable + "\n");
        await this.add("| |" + allEnemies.map(enemy => "⚔️  : " + enemy.weapon + " ❤️  : " + enemy.endurance).join(" | ") + " |\n\n");
        await this.add("VS\n\n");
        await this.add("Mon Equipe : | " + player.name + (partner ?  " |" + partner.name : "") + " |\n");
        await this.add("|--:|:--:|" + (partner ? ":--:|" : "") + "\n");
        await this.add("| |⚔️  : " + player.weapon + " ❤️  : " + player.endurance.value + (partner ? " | ⚔️  : " + partner.weapon + " ❤️  : " + partner.endurance : "") + " |\n\n");
        await this.divider();
    }

    async turns(turns) {
        await this.add("Les tours :\n\n");
        let turnLine = "| Tour |";
        let lineTable = "|--:|";
        let charactersLine = {};

        for (const character in turns[0]) {
            charactersLine[character] = `| ${character} |`;
        }

        for (let i = 0; i < turns.length; i++) {
            // Create the first and second line (turnLine, lineTable)
            turnLine += ` ${i} |`;
            lineTable += ":--:|";
            // Create the line for each character
            for (const character in turns[i]) {
                charactersLine[character] += ` ${turns[i][character]} |`;
            }
        }

        await this.add(turnLine + "\n")
        await this.add(lineTable + "\n")

        for (const character in charactersLine) {
            await this.add(charactersLine[character] + "\n")
        }
    }
}

module.exports = File;