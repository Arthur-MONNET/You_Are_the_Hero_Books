const Enemy = require('./Enemy.js');
const Partner = require('./Partner.js');
const input = require('../utils/input.js');
const out = require('../utils/output.js');


class Fight {
    constructor(file, player, weapon, enemies, eventmanager, options = {}) {
        const { maxTurn, minPlayerEndurance, partner, partnerEnemies, abandon,
        } = options;
        this.file = file;
        this.player = player;
        this.player.weapon = this.player[weapon].value;
        this.eventManager = eventmanager;
        this.partner = partner ? new Partner(partner.name, parseInt(partner[weapon]), parseInt(partner.endurance), null) : null;
        this.enemies = enemies.map(enemy => new Enemy(enemy.name, parseInt(enemy[weapon]), parseInt(enemy.endurance), player));
        this.partnerEnemies = partnerEnemies && partner ? partnerEnemies.map(enemy => new Enemy(enemy.name, parseInt(enemy[weapon]), parseInt(enemy.endurance), this.partner)) : null;
        this.enemiesDeath = [];
        this.maxTurn = maxTurn;
        this.minPlayerEndurance = minPlayerEndurance;
        this.abandon = abandon;
        this.turn = 0;
        this.turns = [];
    }

    async run() {
        try {

            while (this.turn <= this.maxTurn) {
                this.newTurn();
                // Player's turn
                const playerWin = await this.playerTurn();
                // Enemy's turn
                const enemyWin = await this.enemiesTurn();
                // Check if the enemy has won
                if (enemyWin) {
                    return 'enemies';
                }
                // Partner's turn (if applicable)
                if (this.partner) {
                    if (this.partner.endurance <= 0) {
                        this.turns[this.turn][this.partner.name] = "☠️";
                    } else {
                        const partnerWin = await this.partnerTurn();
                        // Check if the partner has won
                        if (partnerWin) {
                            // Check if the player has also won
                            if (playerWin) {
                                return 'player';
                            }
                            // Set the partner's target to the first enemy
                            this.partner.targeted = this.enemies[0];
                        }
                        // Partner's enemies' turn (if applicable)
                        const partnerEnemyWin = await this.partnerEnemiesTurn();
                        // Check if the partner's enemies have won
                        if (partnerEnemyWin) {
                            this.partnerEnemies.map(enemy => enemy.targeted = this.player);
                            // Add the partner's enemies back to the list of enemies
                            this.enemies.push(...this.partnerEnemies);
                        }
                    }

                }
                // Check if the player has won
                if (playerWin) {
                    // If the partner exists, add the partner's enemies back to the list and set the partner's target to the first enemy
                    if (this.partner) {
                        this.enemies.push(...this.partnerEnemies);
                        this.partner.targeted = this.enemies[0];
                    } else {
                        // Otherwise, return 'player'
                        return 'player';
                    }
                }
                // Increment the turn count and write the turn
                this.turn++;
                if (await this.askAbandon()) {
                    return 'abandon';
                }

            }
            // Return 'exceeded' if the maximum number of turns has been reached
            return 'exceeded';
        } catch (error) {
            throw error;
        }
    }

    async askAbandon() {
        if (!this.abandon) return false;
        try {
            input.getSpecificKeys("Voulez-vous abandonner ? (o/n)", ['o', 'n'])
                .then((res) => {
                    if (res === 'o') {
                        return true;
                    }
                    return false;
                })
        } catch (error) {
            throw error;
        }
    }

    async playerTurn() {
        try {
            out.listFighters(this.enemies, this.player)
            const enemy = await input.askChoiceEnemy(this.enemies);
            this.player.targeted = enemy;
            this.saveAttack(this.player, await this.player.attack());
            
            if (enemy.endurance <= 0) {
                this.enemiesDeath.push(enemy);
                this.enemies = this.enemies.filter(e => e.name !== enemy.name);
                out.characterDeath(enemy);
            }
            
            return this.enemies.length === 0;
        } catch (error) {
            throw error;
        }
    }

    async enemiesTurn() {
        try {
            for (const enemy of this.enemies) {
                this.saveAttack(enemy, await enemy.attack());
                if (this.player.endurance.value <= this.minPlayerEndurance) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    async partnerTurn() {
        try {
            out.listFighters(this.partnerEnemies.length > 0 ? this.partnerEnemies : this.enemies, this.partner);
            this.partner.targeted = this.partnerEnemies.length > 0 ? this.partnerEnemies[0] : this.enemies[0];
            this.saveAttack(this.partner, await this.partner.attack());
            if (this.partner.targeted.endurance <= 0) {
                this.enemiesDeath.push(this.partner.targeted);
                this.partnerEnemies = this.partnerEnemies.filter(e => e.name !== this.partner.targeted.name);
                out.characterDeath(this.partner.targeted);
                if (this.enemies.length === 0) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    async partnerEnemiesTurn() {
        try {
            for (const enemy of this.partnerEnemies) {
                this.saveAttack(enemy, await enemy.attack());
                if (this.partner.endurance <= 0) {
                    out.characterDeath(this.partner);
                    if(this.partner.name === "comte") this.eventManager.comteLiving = false;
                    else if(this.partner.name === "marquis") this.eventManager.marquisLiving = false;
                    return true;
                }
            }
            return false;
        } catch (error) {
            throw error;
        }
    }

    newTurn() {
        this.turns.push({});
        this.turns[this.turn][this.player.name] = 0;
        for (const enemy of this.enemies) {
            this.turns[this.turn][enemy.name] = 0;
        }
        if (this.partner) {
            if(this.partner.endurance <= 0) this.turns[this.turn][this.partner.name] = "☠️";
            else this.turns[this.turn][this.partner.name] = 0;
            for (const enemy of this.partnerEnemies) {
                this.turns[this.turn][enemy.name] = 0;
            }
        }
        for (const death of this.enemiesDeath) {
            this.turns[this.turn][death.name] = "☠️";
        }
    }

    saveAttack(character, attack) {
        this.turns[this.turn][character.targeted.name] -= attack ? 1 : 0;
    }

    async writeIntro() {
        this.file.listFighters(this.enemies, this.player, this.partner, this.partnerEnemies);
    }

    async writeTurns() {
        await this.file.turns(this.turns)
    }

}

module.exports = Fight;