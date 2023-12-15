const { SlashCommandBuilder } = require('discord.js');
const { Snake } = require('../../../func/discord-gamecord');
const { CheckAch } = require('../../../func/games/giveAch.js');

module.exports = {
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName('snake')
		.setDescription('Игра в змейку')
		.addIntegerOption((option) =>
			option
				.setName('ширина')
				.setDescription('Ширина поля (5-15)')
				.setMinValue(5)
				.setMaxValue(15))
		.addIntegerOption((option) =>
			option
				.setName('высота')
				.setDescription('Высота поля (5-10)')
				.setMinValue(5)
				.setMaxValue(10)),
	async execute(interaction, guild) {
		await interaction.deferReply();
		const v = interaction.options.getInteger('высота') || 10;
		const z = interaction.options.getInteger('ширина') || 10;
		const Game = new Snake({
			message: interaction,
			isSlashGame: true,
			height: v,
			width: z,
			embed: {
				title: 'Змейка',
				overTitle: 'Игра окончена',
				color: guild.colors.basic,
			},
			emojis: {
				board: '⬛',
				food: '🍎',
				up: '⬆️',
				down: '⬇️',
				left: '⬅️',
				right: '➡️',
			},
			snake: { head: '🟢', body: '🟩', tail: '🟩', skull: '😭 ' },
			foods: ['🍎'],
			stopButton: 'Стоп',
			timeoutTime: 60000,
			playerOnlyMessage: 'Только {player} может использовать кнопки.',
		});

		Game.startGame();

		Game.on('gameOver', result => {
			if(result.score >= 50) {
				CheckAch(2, interaction.user.id, interaction.channel)
			}
		  });
	},
};
