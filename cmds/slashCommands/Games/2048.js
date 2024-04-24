const { SlashCommandBuilder } = require('discord.js');
const { TwoZeroFourEight } = require('../../../func/discord-gamecord');
const { CheckAch } = require('../../../func/games/giveAch.js');

module.exports = {
	cooldown: 30,
	skip: true,
	data: new SlashCommandBuilder()
		.setName('2048')
		.setDescription('Игра 2048'),
	async execute(interaction, guild) {
		await interaction.deferReply();

		const Game = new TwoZeroFourEight({
			message: interaction,
			isSlashGame: true,
			embed: {
				title: '2048',
				color: guild.colors.basic,
			},
			emojis: {
				up: '⬆️',
				down: '⬇️',
				left: '⬅️',
				right: '➡️',
			  },
			  timeoutTime: 60000,
			  buttonStyle: 'PRIMARY',
			  playerOnlyMessage: 'Эта игра предназначена для {player}'
		});

		Game.startGame();

		Game.on('gameOver', result => {
			if(result.score >= 2048) {
				CheckAch(11, interaction.user.id, interaction.channel)
			}
		  });
	},
};
