const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	skip: true,
	cooldown: 50,
	data: new SlashCommandBuilder()
		.setName('mafia')
		.setDescription('Игра в мафию'),
	async execute(interaction) {
		await interaction.deferReply();
	},
};
