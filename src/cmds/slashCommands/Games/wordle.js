const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { emojis } = require('../../../config.js');

const words = require('../../../games_src/wordle.json');

const games = new Map();

module.exports = {
	category: 'games',
	cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('wordle')
		.setDescription('Игра, в которой требуется угадать 5-ти буквенное слово'),
	async execute(interaction, guild) {
		await interaction.deferReply();

		const gameState = {
			word: words[Math.floor(Math.random() * words.length)].toLowerCase(),
			attempts: 0,
			maxAttempts: 6,
			guesses: [],
			isActive: true
		};

		games.set(interaction.channelId, gameState);

		const gameEmbed = new EmbedBuilder()
			.setColor(guild.colors.basic)
			.setTitle('Wordle')
			.setDescription('Угадайте слово из 5 букв!\nУ вас есть 6 попыток.')
			.addFields(
				{ name: 'Попытки', value: '0/6', inline: true },
				{ name: 'Статус', value: 'Идёт игра', inline: true }
			);

		const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('surrender')
					.setLabel('Сдаться')
					.setStyle(ButtonStyle.Danger)
			);

		const response = await interaction.editReply({
			embeds: [gameEmbed],
			components: [row]
		});

		const filter = i => i.user.id === interaction.user.id;
		const collector = response.createMessageComponentCollector({ filter, time: 300000 });
		const messageCollector = interaction.channel.createMessageCollector({ filter: m => m.author.id === interaction.user.id, time: 300000 });

		messageCollector.on('collect', async (message) => {
			if (!games.has(interaction.channelId)) return;

			const game = games.get(interaction.channelId);
			const guess = message.content.toLowerCase();

			if (guess.length !== 5) {
				message.reply('Слово должно состоять из 5 букв!').then(msg => {
					setTimeout(() => msg.delete(), 3000);
				});
				return;
			}

			game.attempts++;
			let feedback = '';
			for (let i = 0; i < guess.length; i++) {
				if (guess[i] === game.word[i]) {
					feedback += '🟩';
				} else if (game.word.includes(guess[i])) {
					feedback += '🟨';
				} else {
					feedback += '⬛';
				}
			}
			game.guesses.push({ guess, feedback });

			const newEmbed = EmbedBuilder.from(response.embeds[0])
				.setFields(
					{ name: 'Попытки', value: `${game.attempts}/6`, inline: true },
					{ name: 'Ваши попытки', value: game.guesses.map(g => `${g.guess} ${g.feedback}`).join('\n') })

			await response.edit({ embeds: [newEmbed] });

			if (guess === game.word) {
				gameWon(interaction, game, response, guild);
				games.delete(interaction.channelId);
				messageCollector.stop();
				collector.stop();
			} else if (game.attempts >= game.maxAttempts) {
				gameLost(interaction, game, response, guild);
				games.delete(interaction.channelId);
				messageCollector.stop();
				collector.stop();
			}

			message.delete().catch(() => { });
		});

		collector.on('collect', async (i) => {
			if (i.customId === 'surrender') {
				const game = games.get(interaction.channelId);
				gameLost(interaction, game, response, guild);
				games.delete(interaction.channelId);
				messageCollector.stop();
				collector.stop();
			}
		});
	},
};

async function gameWon(interaction, game, response, guild) {
	const winEmbed = new EmbedBuilder()
		.setColor(guild.colors.correct)
		.setTitle('Победа!')
		.setDescription(`Поздравляем! Вы угадали слово "${game.word}" за ${game.attempts} попыток!`)
		.setFields(
			{ name: 'Попытки', value: `${game.attempts}/6`, inline: true },
			{ name: 'Ваши попытки', value: game.guesses.map(g => `${g.guess} ${g.feedback}`).join('\n') })

	await response.edit({ embeds: [winEmbed], components: [] });
}

async function gameLost(interaction, game, response, guild) {
	const loseEmbed = new EmbedBuilder()
		.setColor(guild.colors.error)
		.setTitle('Поражение!')
		.setDescription(`К сожалению, вы не угадали слово. Это было "${game.word}"`)
		.setFields(
			{ name: 'Попытки', value: `${game.attempts}/6`, inline: true },
			{ name: 'Ваши попытки', value: game?.guesses?.map(g => `${g.guess} ${g.feedback}`).join('\n') || "Нет" }
		);

	await response.edit({ embeds: [loseEmbed], components: [] });
}