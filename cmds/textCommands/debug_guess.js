const { EmbedBuilder } = require("discord.js");

exports.run = async (client, message, args) => {
  return message.reply("Команда отключена");

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const game = require("../../games_src/logo.json");

  for (i = 0; i <= game.length; i++) {
    item = game[i];

    const embed = new EmbedBuilder()
      .setDescription(`${item.id} - ${item.answers[0]}`)
      .setImage(item.image);

    await message.reply({ embeds: [embed] });
    await sleep(100);
  }
};
exports.help = {
  name: ",g-d",
  aliases: [",guess-debug"],
  description:
    "Инструмент для поиска картинок, которые не отображаются в играх",
};
