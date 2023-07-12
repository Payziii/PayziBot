const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Список команд'),
    async execute(interaction, guild) {
        const embed = new EmbedBuilder()
        .setTitle("Список доступных команд")
        .setDescription("Бот использует слэш-команды. Для вызова команды введите `/команда`")
        .addFields(
          {
            name: "Основное",
            value: "`help`, `avatar`, `userinfo`, `stats`, `translate`, `weather`, `github`",
          },
          {
            name: "Модерация",
            value: "`ban`, `kick`, `mute`, `unmute`, `channel`, `config`",
          },
          {
            name: "Музыка",
            value: "`play`, `nowplaying`, `stop`, `skip`, `volume`",
          },
        )
        .setThumbnail(`https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.webp`)
        .setColor(guild.settings.other.color)
        .setFooter({
          text: "Команды бота PayziBot",
        });
            await interaction.reply({ embeds: [embed] });
    },
};
