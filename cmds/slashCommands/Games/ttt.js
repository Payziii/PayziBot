const { SlashCommandBuilder } = require('discord.js');
const { TicTacToe } = require('../../../func/discord-gamecord');
const { emojis } = require('../../../config.js');

module.exports = {
	category: 'games',
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName('ttt')
		.setDescription('Крестики-Нолики')
		.addUserOption((option) =>
			option
				.setName('пользователь')
				.setDescription('Пользователь, с которым хотите поиграть.')
				.setRequired(true)),
	async execute(interaction, guild) {
		await interaction.deferReply();
		const user = interaction.options.getUser('пользователь');

		if (interaction.user.id == user.id) return interaction.editReply(`${emojis.error} | Вы не можете играть сами с собой!`);
		if (user.bot) return interaction.editReply(`${emojis.error} | Вы не можете играть с ботами!`);

		const Game = new TicTacToe({
			message: interaction,
			isSlashGame: true,
			opponent: user,
			embed: {
				title: 'Крестики-Нолики',
				color: guild.colors.basic,
				statusTitle: 'Игра',
				overTitle: 'Игра окончена',
			},
			emojis: {
				xButton: '❌',
				oButton: '⭕',
				blankButton: '➖',
			},
			mentionUser: true,
			timeoutTime: 60000,
			xButtonStyle: 'SECONDARY',
			oButtonStyle: 'SECONDARY',
			turnMessage: '{emoji} | Ход игрока **{player}**.',
			winMessage: '{emoji} | **{player}** выиграл!',
			tieMessage: 'Игра завершена. Никто не победил.',
			timeoutMessage: 'Время ожидания истекло. Игра завершена.',
			playerOnlyMessage: 'Только {player} и {opponent} могут использовать кнопки.',
		});

		Game.startGame();
	},
};
