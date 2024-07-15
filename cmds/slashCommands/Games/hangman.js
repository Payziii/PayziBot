const { SlashCommandBuilder } = require('discord.js');
const hangman = require('../../../func/discord-hangman');
const words = require('../../../games_src/hangman.json');

module.exports = {
	category: 'games',
	cooldown: 30,
	data: new SlashCommandBuilder()
		.setName('hangman')
		.setDescription('Игра в виселицу'),
	async execute(interaction) {
		let del = true;
		const bot = await interaction.guild.members.me;
		if (bot.permissions.has('ManageMessages') == false) del = false;
		const item = words[Math.floor(Math.random() * words.length)];
		await hangman.create(interaction, 'random', { word: item, players: [interaction.user], del: del });
	},
};
