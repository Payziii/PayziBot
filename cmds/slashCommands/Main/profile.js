const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Ваша игровая статистика'),
    async execute(interaction, guild, user) {
        const embed = new EmbedBuilder()
        .setTitle("Игровая статистика")
        .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp`)
        .addFields(
          {
            name: "Угадано",
            value: `<:arrow:1140937463209152572> Игр: **${user.games.game}**\n<:arrow:1140937463209152572> Городов: **${user.games.city}**\n<:arrow:1140937463209152572> Логотипов: **${user.games.logo}**\n<:arrow:1140937463209152572> Флагов: **${user.games.flag}**`,
          },
        )
        .setColor(guild.colors.basic)
            await interaction.reply({ embeds: [embed] });
    },
};
