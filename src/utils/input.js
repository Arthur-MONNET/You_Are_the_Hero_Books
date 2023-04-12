const readline = require('readline');
const out = require('./output');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function getInput(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, (response) => {
            resolve(response);
        });
    });
}

async function getSpecificKey(key, prompt, errorMessage = "Oups mauvais bouton !") {
    try {
        let response = await getInput(prompt);
        if (response === key) {
            return response;
        } else {
            out.error(errorMessage);
            return await getSpecificKey(key, prompt, errorMessage);
        }
    } catch (error) {
        throw error;
    }
}

async function getSpecificKeys(prompt, keys) {
    try {
        let response = await getInput(prompt);
        let key = keys.find((key) => key === response);
        if (key) {
            return key;
        } else {
            out.error("Oups mauvais bouton !");
            return await getSpecificKeys(prompt, keys);
        }
    } catch (error) {
        throw error;
    }
}

async function askChoice(choices) {
    try {
        let text = "";
        let choicesIndex = []
        choices.forEach((choice, index) => {
            if (index !== 0) {
                if (index === choices.length - 1) {
                    text += " ou " + (index + 1);
                } else {
                    text += ", " + (index + 1);
                }
            } else {
                text += (index + 1);
            }
            choicesIndex.push((index + 1).toString());
        });
        const response = await getSpecificKeys(
            "Pressez " + text + "... ",
            choicesIndex
        );
        return choices[response - 1];
    } catch (error) {
        throw error;
    }
}

async function askChoiceEnemy(enemies) {
    try {
        if (enemies.length === 1) {
            return enemies[0];
        }
        // ask choice
        let listTextChoices = "(";
        enemies.forEach((enemy, index) => {
            listTextChoices += (index + 1)
            if (index !== enemies.length - 1) {
                listTextChoices += ", ";
            }
        });

        const response = await getSpecificKeys(
            "Choisissez un ennemi " + listTextChoices + ") ... ",
            enemies.map((enemy, index) => (index + 1).toString())
        );
        out.space()
        return enemies[response - 1];

    } catch (error) {
        throw error;
    }
}

module.exports = {
    getInput,
    getSpecificKey,
    getSpecificKeys,
    askChoice,
    askChoiceEnemy
};