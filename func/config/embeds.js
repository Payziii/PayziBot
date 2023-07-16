const {EmbedBuilder} = require("discord.js");

function general(guild) {
    const embed = new EmbedBuilder()
  .setTitle("Конфигурация бота")
  .setDescription("Здесь можно настроить различные компоненты бота индивидуально под ваш сервер")
  .addFields(
    {
      name: "Основное",
      value: `Цвет embed: **${guild.settings.other.color}**`,
    },
  )
  .setColor(guild.settings.other.color)
  .setFooter({
    text: "Выберите пункт настроек по кнопке ниже",
  });

  return embed;
}
  
  module.exports = {
    general
  }