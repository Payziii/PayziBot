const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Gen } = require('../../../func/games/tipGen.js');
const give = require('../../../func/games/guessUserCorrect.js');
const games = require('../../../func/games/guessCounting.js');

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
				.setName('country')
				.setDescription('Угадай страну по картинке и описанию')),
	async execute(interaction, guild) {
		await interaction.deferReply();
		// GAME
		// GAME
		// GAME
		if (interaction.options.getSubcommand() === 'game') {
			const name = 'game';
			const { item } = await require('node-fetch')(`http://api.fifty.su/v1/guess/game`).then(r => r.json())
			console.log(item)
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
			const { item } = await require('node-fetch')(`http://api.fifty.su/v1/guess/city`).then(r => r.json())
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
			const { item } = await require('node-fetch')(`http://api.fifty.su/v1/guess/logo`).then(r => r.json())
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
			// COUNTRY
			// COUNTRY
			// COUNTRY
		}
		else if (interaction.options.getSubcommand() === 'country') {
			const name = 'country';
			const { item } = await require('node-fetch')(`http://api.fifty.su/v1/guess/country`).then(r => r.json())
			const image = item.image[Math.floor(Math.random() * item.image.length)];
			const collectorFilter = response => {
				return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
			};
			games.gameGiveAll(name, item.id);
			const percent = await games.gameGetPercent(name, item.id);
			let podsk = '';
			if (percent < 30) podsk = '\nПодсказка: **' + Gen(item.answers[0]) + '**';
			const embed = new EmbedBuilder()
				.setTitle('Угадай страну')
				.setDescription(`У вас есть **60 секунд** чтобы назвать страну по **описанию** и **картинке** с Google Maps.\n\nОписание: **${item.text}**${podsk}`)
				.setImage(image)
				.setFooter({ text: `Страну угадали ${percent}% пользователей` })
				.setColor(guild.colors.basic);

			interaction.editReply({ embeds: [embed], fetchReply: true })
				.then(() => {
					interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 60000, errors: ['time'] })
						.then(collected => {
							const embed1 = new EmbedBuilder()
								.setTitle('Угадай страну')
								.setDescription(`Ответ: **${item.answers[0]}**`)
								.setImage(image)
								.setColor(guild.colors.correct);
							interaction.followUp({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
							give.CorrectCountry(collected.first().author.id, interaction.channel);
							games.gameGiveVerno(name, item.id);
						})
						.catch(() => {
							const embed5 = new EmbedBuilder()
								.setTitle('Угадай страну')
								.setDescription(`Ответ: **${item.answers[0]}**`)
								.setImage(image)
								.setColor(guild.colors.error);
							interaction.followUp({ content: '**Победителей нет(**', embeds: [embed5] });
						});
				});
		}
	},
};
