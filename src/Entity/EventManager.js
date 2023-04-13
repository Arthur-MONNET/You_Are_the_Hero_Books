const input = require('../utils/input.js');
const out = require('../utils/output.js');
const Fight = require('./Fight.js');

const Dice = require("./Dice.js");
const dice = new Dice();

class EventManager {
    constructor(player, file) {
        this.player = player;
        this.file = file;
        this.marquisLiving = true;
        this.comteLiving = true;
        this.currentEvent = {}
    }

    setPageManager(pageManager) {
        this.pageManager = pageManager;
    }

    // methode qui va appeler la bonne methode en fonction du type d'event
    run(event) {
        this.currentEvent = event;
        switch (event.type) {
            case "redirect":
                this.redirect();
                break;
            case "choice":
                this.choice();
                break;
            case "fight":
                this.fight();
                break;
            case "end":
                this.end();
                break;
            case "point":
                this.point();
                break;
            case "test":
                this.test();
                break;
            default:
                out.error("Event type not found");
        }
    }

    redirect() {
        this.pageManager.goTo(this.currentEvent.data.redirect);
    }

    async choice() {
        const choices = this.currentEvent.data.choices
        const question = this.currentEvent.data.question
        out.drawChoices(question, choices);
        await this.file.addQuestion(question, choices);
        let choice = await input.askChoice(choices);
        await this.file.addChoice(choice);
        this.pageManager.goTo(choice.redirect);
    }

    fight() {
        const data = this.currentEvent.data;
        const options = {
            maxTurn: data.nbTry || 50,
            minPlayerEndurance: data.limit || 0,
            partner: data.partner || null,
            partnerEnemies: data.partner ? data.partner.enemies : null,
            abandon: !!data.abandon,
        }

        const fight = new Fight(this.file, this.player, data.weapon, data.enemies, this, options);
        fight.writeIntro().then(() => {
            fight.run().then(res => {
                fight.writeTurns().then(() => {
                    switch (res) {
                        case "player":
                            this.pageManager.goTo(data.valid);
                            break;
                        case "enemies":
                            this.pageManager.goTo(data.noValid);
                            break;
                        case "exceeded":
                            this.pageManager.goTo(data.noTry || data.noValid);
                            break;
                        case "abandon":
                            this.pageManager.goTo(data.abandon);
                            break;
                        default:
                            out.error("Fight result not found : " + res);
                    }
                })
            })
        })
        
    }

    end() {
        if (this.currentEvent.data.death) out.death()
        else out.win()
    }

    async point() {
        const data = this.currentEvent.data
        if (data.nbPoint === "init") {
            this.player[data.quality].value = this.player[data.quality].max
        } else {
            this.player[data.quality].value += parseInt(data.nbPoint)
        }

        let text = "";
        out.space()
        if (data.nbPoint === "init") {
            text += "Vous retrouvez " + this.player[data.quality].value + " sur votre qualité : " + this.player[data.quality].fr + " " + this.player[data.quality].icon
            out.log("blue", text)
        } else if (parseInt(data.nbPoint) < 0) {
            text += "Vous perdez " + parseInt(data.nbPoint) * -1 + " sur votre qualité : " + this.player[data.quality].fr + " " + this.player[data.quality].icon
            out.log("red", text)

        } else {
            text += "Vous gagnez " + parseInt(data.nbPoint) + " sur votre qualité : " + this.player[data.quality].fr + " " + this.player[data.quality].icon
            out.log("green", text)
        }
        out.log("blue", this.player[data.quality].fr + " : " + this.player[data.quality].value + " " + this.player[data.quality].icon)
        await this.file.add("\n" + text + "\n")
        this.pageManager.goTo(data.redirect)
    }


    makeTest(condition, textValid, textNoValid) {
        if (condition) {
            out.logln("green", textValid)
            this.file.add("\n" + textValid + "\n").then(() => {
                this.pageManager.goTo(this.currentEvent.data.valid)
            })
        } else {
            out.logln("red", textNoValid)
            this.file.add(textNoValid + "\n").then(() => {
                this.pageManager.goTo(this.currentEvent.data.noValid)
            })

        }
    }

    test() {
        const quality = this.currentEvent.data.category
        if (["useGun", "comteLife", "marquisLife", "belongs_to_military"].includes(quality)) {
            input.getSpecificKey("", "\nPressez ENTREE...  ↩️").then(res => {
                if (quality === "useGun") {
                    this.makeTest(this.player.useGun === 0, "Vous avez déjà utilisé votre pistolet !", "Vous n'avez pas récement utilisé votre pistolet")
                } else if (quality === "belongs_to_military") {
                    this.makeTest(this.player.belongs_to_military, "Vous appartenez à l'armée !", "Vous ne faites pas parti de l'armée.")
                } else if (quality === "comteLiving") {
                    this.makeTest(this.comteLiving, "Le comte est mort...", "Le comte est vivant !");
                } else if (quality === "marquisLiving") {
                    this.makeTest(this.marquisLiving, "Le marquis est mort...", "Le marquis est vivant !");
                }
            });
        } else {
            out.logln("yellow", "\nTestez votre " + this.player[quality].fr + " [ " + this.player[quality].icon + "  : " + this.player[quality].value + " ]")
            dice.roll().then(res => {
                if (quality === "dexterity") this.player.useGun = 2
                this.makeTest(res <= this.player[quality].value, "Vous réussissez le teste de la qualité : " + this.player[quality].fr + " !", "Vous échouez le teste de la qualité : " + this.player[quality].fr + " !")
            });
        }
    }
}

module.exports = EventManager;