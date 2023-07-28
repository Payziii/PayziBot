const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const give = require('../../../func/games/guessUserCorrect.js');
const quiz = require('../../../games_scr/distr.json');
const gquiz = require('../../../games_scr/game.json');
const cquiz = require('../../../games_scr/city.json');
module.exports = {
    cooldown: 9,
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Угадай что-то по картинке')
        .addSubcommand(subcommand =>
            subcommand
                .setName('distributions')
                .setDescription('Угадай дистрибутив'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('city')
                .setDescription('Угадай город'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('games')
                .setDescription('Угадай игру')),
    async execute(interaction, guild) {
        await interaction.deferReply();
// DISTR
// DISTR
// DISTR
        if (interaction.options.getSubcommand() === 'distributions') {
            const item = quiz[Math.floor(Math.random() * quiz.length)];
            const collectorFilter = response => {
                return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
            };
            const embed = new EmbedBuilder()
  .setTitle("Угадай дистрибутив")
  .setDescription("У вас есть **30 секунд** чтобы ответить, какой дистрибутив изображен на картинке ниже")
  .setImage(item.image)
  .setColor(guild.settings.colors.basic);

            interaction.editReply({ embeds: [embed], fetchReply: true })
	.then(() => {
		interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
                const embed1 = new EmbedBuilder()
  .setTitle("Угадай дистрибутив")
  .setDescription(`Ответ: **${item.answers[0]}**\nИнтересный факт: **${item.fact || "Отсутствует"}**`)
  .setImage(item.image)
  .setColor(guild.settings.colors.correct);
				interaction.followUp({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
                give.CorrectDistr(collected.first().author.id)
			})
			.catch(collected => {
                const embed5 = new EmbedBuilder()
                .setTitle("Угадай дистрибутив")
                .setDescription(`Ответ: **${item.answers[0]}**\nИнтересный факт: **${item.fact || "Отсутствует"}**`)
                .setImage(item.image)
                .setColor(guild.settings.colors.error);
                              interaction.followUp({  content: `**Победителей нет(**`, embeds: [embed5] });
			});
	});
// GAMES
// GAMES
// GAMES
        }else if (interaction.options.getSubcommand() === 'games') {
            const item = gquiz[Math.floor(Math.random() * gquiz.length)];
            const collectorFilter = response => {
                return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
            };
            const embed = new EmbedBuilder()
  .setTitle("Угадай игру")
  .setDescription("У вас есть **30 секунд** чтобы ответить, какая игра изображена на картинке ниже")
  .setImage(item.image)
  .setColor(guild.settings.colors.basic);

            interaction.editReply({ embeds: [embed], fetchReply: true })
	.then(() => {
		interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
                const embed1 = new EmbedBuilder()
  .setTitle("Угадай игру")
  .setDescription(`Ответ: **${item.answers[0]}**`)
  .setImage(item.image)
  .setColor(guild.settings.colors.correct);
				interaction.followUp({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
                give.CorrectGame(collected.first().author.id)
			})
			.catch(collected => {
                const embed5 = new EmbedBuilder()
                .setTitle("Угадай игру")
                .setDescription(`Ответ: **${item.answers[0]}**`)
                .setImage(item.image)
                .setColor(guild.settings.colors.error);
                              interaction.followUp({  content: `**Победителей нет(**`, embeds: [embed5] });
			});
	});
// CITY
// CITY
// CITY
        }else if (interaction.options.getSubcommand() === 'city') {
            const item = cquiz[Math.floor(Math.random() * cquiz.length)];
            const collectorFilter = response => {
                return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
            };
            const embed = new EmbedBuilder()
  .setTitle("Угадай город")
  .setDescription(`У вас есть **30 секунд** чтобы ответить, какой город изображен на фото ниже\nСтрана: **${item.country}**`)
  .setImage(item.image)
  .setColor(guild.settings.colors.basic);

            interaction.editReply({ embeds: [embed], fetchReply: true })
	.then(() => {
		interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
                const embed1 = new EmbedBuilder()
  .setTitle("Угадай город")
  .setDescription(`Ответ: **${item.answers[0]}**\nСтрана: **${item.country}**`)
  .setImage(item.image)
  .setColor(guild.settings.colors.correct);
				interaction.followUp({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
                give.CorrectCity(collected.first().author.id)
			})
			.catch(collected => {
                const embed5 = new EmbedBuilder()
                .setTitle("Угадай город")
                .setDescription(`Ответ: **${item.answers[0]}**\nСтрана: **${item.country}**`)
                .setImage(item.image)
                .setColor(guild.settings.colors.error);
                              interaction.followUp({  content: `**Победителей нет(**`, embeds: [embed5] });
			});
	});
        }
    },
};
