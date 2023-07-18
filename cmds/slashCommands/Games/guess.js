const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const quiz = require('../../../games_scr/distr.json');
const gquiz = require('../../../games_scr/game.json');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Угадай что-то по картинке')
        .addSubcommand(subcommand =>
            subcommand
                .setName('distributions')
                .setDescription('Угадай дистрибутив'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('games')
                .setDescription('Угадай игру')),
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
  .setDescription(`Ответ: **${item.answers[0]}**\nИнтересный факт: **${item.fact || "Отсутствует"}**`)
  .setImage(item.image)
  .setColor(guild.settings.other.color);
				interaction.followUp({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
			})
			.catch(collected => {
                const embed5 = new EmbedBuilder()
                .setTitle("Угадай дистрибутив")
                .setDescription(`Ответ: **${item.answers[0]}**\nИнтересный факт: **${item.fact || "Отсутствует"}**`)
                .setImage(item.image)
                .setColor(guild.settings.other.color);
                              interaction.followUp({  content: `**Победителей нет(**`, embeds: [embed5] });
			});
	});
        }else if (interaction.options.getSubcommand() === 'games') {
            const item = gquiz[Math.floor(Math.random() * gquiz.length)];
            const collectorFilter = response => {
                return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
            };
            const embed = new EmbedBuilder()
  .setTitle("Угадай игру")
  .setDescription("У вас есть **30 секунд** чтобы ответить, какая игра изображена на картинке ниже")
  .setImage(item.image)
  .setColor(guild.settings.other.color);

            interaction.editReply({ embeds: [embed], fetchReply: true })
	.then(() => {
		interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
                const embed1 = new EmbedBuilder()
  .setTitle("Угадай игру")
  .setDescription(`Ответ: **${item.answers[0]}**`)
  .setImage(item.image)
  .setColor(guild.settings.other.color);
				interaction.followUp({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
			})
			.catch(collected => {
                const embed5 = new EmbedBuilder()
                .setTitle("Угадай игру")
                .setDescription(`Ответ: **${item.answers[0]}**`)
                .setImage(item.image)
                .setColor(guild.settings.other.color);
                              interaction.followUp({  content: `**Победителей нет(**`, embeds: [embed5] });
			});
	});
        }
    },
};
