const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

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
            value: `Дистрибутивов: **${user.games.distr}**\nИгр: **${user.games.game}**\nГородов: **${user.games.city}**\nЛоготипов: **${user.games.logo}**`,
          },
        )
        .setColor(guild.settings.other.color)
            await interaction.reply({ embeds: [embed] });
    },
};
