const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Gen } = require('../../../func/games/tipGen.js');
const give = require('../../../func/games/guessUserCorrect.js');
const games = require('../../../func/games/guessCounting.js');
const game = require('../../../games_src/game.json');
const city = require('../../../games_src/city.json');
const logo = require('../../../games_src/logo.json');
const flag = require('../../../games_src/flag.json');

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
				.setDescription('Угадай игру'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('logo')
				.setDescription('Угадай логотип'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('flag')
				.setDescription('Угадай страну по флагу')),
	async execute(interaction, guild) {
		await interaction.deferReply();
		// GAME
		// GAME
		// GAME
		if (interaction.options.getSubcommand() === 'game') {
			const name = 'game';
			const item = game[Math.floor(Math.random() * game.length)];
			const collectorFilter = response => {
				return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
			};
			games.gameGiveAll(name, item.id);
			const percent = await games.gameGetPercent(name, item.id);
			let podsk = '';
			if (percent < 50) podsk = '\nПодсказка: **' + Gen(item.answers[0]) + '**';
			const embed = new EmbedBuilder()
				.setTitle('Угадай игру')
				.setDescription(`У вас есть **30 секунд** чтобы ответить, какая игра изображена на картинке ниже${podsk}`)
				.setImage(item.image)
				.setFooter({ text: `Игру угадали ${percent}% пользователей` })
				.setColor(guild.colors.basic);

			interaction.editReply({ embeds: [embed], fetchReply: true })
				.then(() => {
					interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
						.then(collected => {
							const embed1 = new EmbedBuilder()
								.setTitle('Угадай игру')
								.setDescription(`Ответ: **${item.answers[0]}**`)
								.setImage(item.image)
								.setColor(guild.colors.correct);
							interaction.followUp({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
							give.CorrectGame(collected.first().author.id);
							games.gameGiveVerno(name, item.id);
						})
						.catch(() => {
							const embed5 = new EmbedBuilder()
								.setTitle('Угадай игру')
								.setDescription(`Ответ: **${item.answers[0]}**`)
								.setImage(item.image)
								.setColor(guild.colors.error);
							interaction.followUp({ content: '**Победителей нет(**', embeds: [embed5] });
						});
				});
			// CITY
			// CITY
			// CITY
		}
		else if (interaction.options.getSubcommand() === 'city') {
			const name = 'city';
			const item = city[Math.floor(Math.random() * city.length)];
			const collectorFilter = response => {
				return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
			};
			games.gameGiveAll(name, item.id);
			const percent = await games.gameGetPercent(name, item.id);
			let podsk = '';
			if (percent < 50) podsk = '\nПодсказка: **' + Gen(item.answers[0]) + '**';
			const embed = new EmbedBuilder()
				.setTitle('Угадай город')
				.setDescription(`У вас есть **30 секунд** чтобы ответить, какой город изображен на фото ниже\nСтрана: **${item.country}**${podsk}`)
				.setImage(item.image)
				.setFooter({ text: `Город угадали ${percent}% пользователей` })
				.setColor(guild.colors.basic);

			interaction.editReply({ embeds: [embed], fetchReply: true })
				.then(() => {
					interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
						.then(collected => {
							const embed1 = new EmbedBuilder()
								.setTitle('Угадай город')
								.setDescription(`Ответ: **${item.answers[0]}**\nСтрана: **${item.country}**`)
								.setImage(item.image)
								.setColor(guild.colors.correct);
							interaction.followUp({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
							give.CorrectCity(collected.first().author.id, interaction.channel);
							games.gameGiveVerno(name, item.id);
						})
						.catch(() => {
							const embed5 = new EmbedBuilder()
								.setTitle('Угадай город')
								.setDescription(`Ответ: **${item.answers[0]}**\nСтрана: **${item.country}**`)
								.setImage(item.image)
								.setColor(guild.colors.error);
							interaction.followUp({ content: '**Победителей нет(**', embeds: [embed5] });
						});
				});
			// LOGO
			// LOGO
			// LOGO
		}
		else if (interaction.options.getSubcommand() === 'logo') {
			const name = 'logo';
			const item = logo[Math.floor(Math.random() * logo.length)];
			const collectorFilter = response => {
				return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
			};
			games.gameGiveAll(name, item.id);
			const percent = await games.gameGetPercent(name, item.id);
			let podsk = '';
			if (percent < 50) podsk = '\nПодсказка: **' + Gen(item.answers[0]) + '**';
			const embed = new EmbedBuilder()
				.setTitle('Угадай логотип')
				.setDescription(`У вас есть **10 секунд** чтобы ответить, чей логотип изображен на фото ниже${podsk}`)
				.setImage(item.image)
				.setFooter({ text: `Логотип угадали ${percent}% пользователей` })
				.setColor(guild.colors.basic);

			interaction.editReply({ embeds: [embed], fetchReply: true })
				.then(() => {
					interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 10000, errors: ['time'] })
						.then(collected => {
							const embed1 = new EmbedBuilder()
								.setTitle('Угадай логотип')
								.setDescription(`Ответ: **${item.answers[0]}**`)
								.setImage(item.image)
								.setColor(guild.colors.correct);
							interaction.followUp({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
							give.CorrectLogo(collected.first().author.id);
							games.gameGiveVerno(name, item.id);
						})
						.catch(() => {
							const embed5 = new EmbedBuilder()
								.setTitle('Угадай логотип')
								.setDescription(`Ответ: **${item.answers[0]}**`)
								.setImage(item.image)
								.setColor(guild.colors.error);
							interaction.followUp({ content: '**Победителей нет(**', embeds: [embed5] });
						});
				});
			// FLAG
			// FLAG
			// FLAG
		}
		else if (interaction.options.getSubcommand() === 'flag') {
			const name = 'flag';
			const item = flag[Math.floor(Math.random() * flag.length)];
			const collectorFilter = response => {
				return item.answer.toString() === response.content.toLowerCase();
			};
			games.gameGiveAll(name, item.id);
			const percent = await games.gameGetPercent(name, item.id);
			const embed = new EmbedBuilder()
				.setTitle('Угадай страну')
				.setDescription(`У вас есть **10 секунд** чтобы ответить, флаг какой страны изображен на фото ниже. Варианты ответов указаны ниже:\n1. **${item.options[0]}**\n2. **${item.options[1]}**\n3. **${item.options[2]}**\n4. **${item.options[3]}**\n5. **${item.options[4]}**`)
				.setImage(item.image)
				.setFooter({ text: `Флаг угадали ${percent}% пользователей` })
				.setColor(guild.colors.basic);

			interaction.editReply({ embeds: [embed], fetchReply: true })
				.then(() => {
					interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 10000, errors: ['time'] })
						.then(collected => {
							const embed1 = new EmbedBuilder()
								.setTitle('Угадай страну')
								.setDescription(`Ответ: **${item.options[item.answer - 1]}**`)
								.setImage(item.image)
								.setColor(guild.colors.correct);
							interaction.followUp({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
							give.CorrectFlag(collected.first().author.id);
							games.gameGiveVerno(name, item.id);
						})
						.catch(() => {
							const embed5 = new EmbedBuilder()
								.setTitle('Угадай страну')
								.setDescription(`Ответ: **${item.options[item.answer - 1]}**`)
								.setImage(item.image)
								.setColor(guild.colors.error);
							interaction.followUp({ content: '**Победителей нет(**', embeds: [embed5] });
						});
				});
		}
	},
};
