const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const Guild = require('../../../database/guild.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Конфигурация сервера'),
    async execute(interaction, guild) {
        const embed = new EmbedBuilder()
  .setTitle("Конфигурация бота")
  .setDescription("Здесь можно настроить различные компоненты бота индивидуально под ваш сервер (**Временно недоступно**)")
  .addFields(
    {
      name: "Основное",
      value: `Градусы в \`weather\`: **${guild.settings.other.weather.degree}**\nЦвет embed: **${guild.settings.other.color}**`,
    },
  )
  .setColor(guild.settings.other.color)
  .setFooter({
    text: "Выберите пункт настроек по кнопке ниже",
  });
            await interaction.reply({ embeds: [embed] });
    },
};