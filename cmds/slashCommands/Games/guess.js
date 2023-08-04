const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const give = require('../../../func/games/guessUserCorrect.js');
const game = require('../../../games_scr/game.json');
const city = require('../../../games_scr/city.json');
module.exports = {
    cooldown: 9,
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Угадай что-то по картинке')
        .addSubcommand(subcommand =>
            subcommand
                .setName('city')
                .setDescription('Угадай город'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('game')
                .setDescription('Угадай игру')),
    async execute(interaction, guild) {
        await interaction.deferReply();
// GAMES
// GAMES
// GAMES
        if (interaction.options.getSubcommand() === 'game') {
            const item = game[Math.floor(Math.random() * game.length)];
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
            const item = city[Math.floor(Math.random() * city.length)];
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
