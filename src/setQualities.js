const out = require("./utils/output.js");
const input = require("./utils/input.js");
const Dice = require("./Entity/Dice.js");
const dice = new Dice();

async function setQualities(player) {
  out.log("white", "Déterminons les caractéristiques de notre héro");
  out.log("white", "\n🎲 Lance les dés ! 🎲\n");
  for (const [id, quality] of player.getQualities()) {
    if (quality.en !== "endurance") {
      out.displayQualityIcon(quality);
      await dice.roll(true);
      player.setProperty(quality.en, dice.total);
      out.displayQualityScore(quality);
    }
  }
  const endurence = player.setEndurance();
  out.displayQualityIcon(endurence);
  await input.getSpecificKey("", "\nPressez ENTREE...  ↩️")
  out.displayQualityScore(endurence);

  return out.displayScoresTable(player);
}

module.exports = setQualities;



