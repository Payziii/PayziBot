const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const quiz = require('../../../games_scr/distr.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Угадай что-то по картинке')
        .addSubcommand(subcommand =>
            subcommand
                .setName('distributions')
                .setDescription('Угадай дистрибутив')),
    async execute(interaction, guild) {
        await interaction.deferReply();
        if (interaction.options.getSubcommand() === 'distributions') {
            const item = quiz[Math.floor(Math.random() * quiz.length)];
            const collectorFilter = response => {
                return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
            };
            const embed = new EmbedBuilder()
  .setTitle("Угадай дистрибутив")
  .setDescription("У вас есть **30 секунд** чтобы ответить, какой дистрибутив изображен на картинке ниже")
  .setImage(item.image)
  .setColor(guild.settings.other.color);

            interaction.editReply({ embeds: [embed], fetchReply: true })
	.then(() => {
		interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
                const embed1 = new EmbedBuilder()
  .setTitle("Угадай дистрибутив")
  .setDescription(`Победитель:  **${collected.first().author}**\nОтвет: **${item.answers[0]}**\nИнтересный факт: **${item.fact || "Отсутствует"}**`)
  .setImage(item.image)
  .setColor(guild.settings.other.color);
				interaction.followUp({ embeds: [embed1] });
			})
			.catch(collected => {
                const embed5 = new EmbedBuilder()
                .setTitle("Угадай дистрибутив")
                .setDescription(`**Никто не угадал(((**\nОтвет: **${item.answers[0]}**\nИнтересный факт: **${item.fact || "Отсутствует"}**`)
                .setImage(item.image)
                .setColor(guild.settings.other.color);
                              interaction.followUp({ embeds: [embed5] });
			});
	});
        }
    },
};
