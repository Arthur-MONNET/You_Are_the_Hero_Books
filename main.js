const File = require("./src/Entity/File.js");
const Player = require("./src/Entity/Player.js");
const setQualities = require("./src/setQualities.js");

const player = new Player();
const recap = new File("./recap.md");
recap.add("# Récapitulatif de votre aventure\n")


const PageManager = require("./src/Entity/PageManager.js");
const EventManager = require("./src/Entity/EventManager.js");
const eventManager = new EventManager(player, recap);
const book = require("./src/dataBook.json");
const pageManager = new PageManager(book, recap, player, eventManager);



function getPageArg() {
    const args = process.argv.slice(2);
    const pageArg = args.find(arg => arg.includes('page='));
    return pageArg ? "p" + pageArg.split('=')[1] : "p1";
}


setQualities(player).then((playerQualitiesTable) => {
    recap.add(playerQualitiesTable);
    player.endurance.value = 3;
    pageManager.start(getPageArg());
});

