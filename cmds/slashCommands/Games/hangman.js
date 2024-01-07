const { SlashCommandBuilder } = require('discord.js');
const hangman = require('../../../func/discord-hangman');
const words = require('../../../games_src/hangman.json');

module.exports = {
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName('hangman')
		.setDescription('Игра в виселицу'),
	async execute(interaction) {
		const item = words[Math.floor(Math.random() * words.length)];
		await hangman.create(interaction, 'random', { word: item, players: [interaction.user] });
	},
};
