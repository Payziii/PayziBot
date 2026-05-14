const { SlashCommandBuilder } = require('discord.js');
const { MatchPairs } = require('../../../func/discord-gamecord');

module.exports = {
	category: 'games',
	cooldown: 15,
	data: new SlashCommandBuilder()
		.setName('memory')
		.setDescription('Найдите пары'),
	async execute(interaction, guild) {
		await interaction.deferReply();

		const Game = new MatchPairs({
			message: interaction,
			isSlashGame: true,
			embed: {
				title: 'Найдите пару',
				color: guild.colors.basic,
				description: 'Кликайте на кнопки и находите одинаковые пары эмодзи!',
			},
			timeoutTime: 60000,
			emojis: ['❄️', '🎁', '🔗', '🔋', '🔥', '🍏', '💳', '💎', '🍓', '🎨', '🍍', '⛄', '🎩', '⭐', '🚀', '💚'],
			winMessage: 'Вы нашли все пары за {time}!',
			loseMessage: 'Вы проиграли. Как жаль...',
			playerOnlyMessage: 'Это игра пользователя {player}.',
		});

		Game.startGame();
	},
};
