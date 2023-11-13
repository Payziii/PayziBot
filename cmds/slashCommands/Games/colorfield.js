const { SlashCommandBuilder } = require('discord.js');
const { Flood } = require('../../../func/discord-gamecord');

module.exports = {
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName('colorfield')
		.setDescription('Цветовое поле'),
	async execute(interaction, guild) {
		await interaction.deferReply();

		const Game = new Flood({
			message: interaction,
			isSlashGame: true,
			embed: {
				title: 'Цветовое поле',
				color: guild.colors.basic,
			},
			difficulty: 13,
			timeoutTime: 60000,
			buttonStyle: 'SECONDARY',
			emojis: ['🟥', '🟦', '🟪', '🟩', '⬜'],
			winMessage: 'Вы выиграли за {turns} ходов.',
			loseMessage: 'Вы проиграли!',
			playerOnlyMessage: 'Только {player} может использовать кнопки!',
		});

		Game.startGame();
	},
};
