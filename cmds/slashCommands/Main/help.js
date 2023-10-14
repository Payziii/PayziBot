const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

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
            name: "Утилиты",
            value: "`help`, `avatar`, `userinfo`, `stats`, `translate`, `weather`, `github`, `serverinfo`",
          },
          {
            name: "Модерация",
            value: "`ban`, `kick`, `mute`, `unmute`, `channel`, `config`, `starboard`, `autoreact`, `clear`",
          },
          {
            name: "Игры",
            value: "`guess`, `profile`",
          },
          {
            name: "Нейросети",
            value: "`image`",
          },
        )
        .setThumbnail(`https://cdn.discordapp.com/icons/${interaction.guild.id}/${interaction.guild.icon}.webp`)
        .setColor(guild.colors.basic)
        .setFooter({
          text: "Желаем приятного использования!",
        });
            await interaction.reply({ embeds: [embed] });
    },
};
