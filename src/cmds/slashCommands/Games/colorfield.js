const { SlashCommandBuilder } = require('discord.js');
const { Flood } = require('../../../func/discord-gamecord');

module.exports = {
	category: 'games',
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName('colorfield')
		.setDescription('Цветовое поле')
		.addNumberOption((option) =>
            option.setName('сложность')
                .setDescription('Сложность игры')
                .setRequired(false)
                .addChoices(
                    { name: 'Лёгкая', value: 8 },
                    { name: 'Средняя', value: 13 },
                    { name: 'Сложная', value: 18 }
                )
        ),
	async execute(interaction, guild) {
		await interaction.deferReply();

		const difficulty = interaction.options.getNumber('сложность') || 13;

		const Game = new Flood({
			message: interaction,
			isSlashGame: true,
			embed: {
				title: 'Цветовое поле',
				color: guild.colors.basic,
			},
			difficulty: difficulty,
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
