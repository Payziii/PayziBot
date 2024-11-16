const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const User = require('../../../database/user.js');
const block = require('../../../games_src/profile/block.json');
const ach = require('../../../games_src/profile/achievements.json');
const { emojis } = require('../../../config.js');
const { getLevelGuild, getLevelUserByGuild, MathNextLevel } = require('../../../database/levels.js');

module.exports = {
	category: 'levels',
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Посмотреть текущий уровень')
		.addUserOption((option) =>
			option
				.setName('пользователь')
				.setDescription('Пользователь, чей уровень надо посмотреть')
		),
	async execute(interaction, guild) {
		await interaction.deferReply();
		let _user = interaction.options.getUser('пользователь') || interaction.user;

		let user = await User.findOne({ userID: _user.id });
		if (!user) return interaction.editReply(`${emojis.error} | Этот пользователь не использовал бота!`);
		let lvlMess;
		const g = await getLevelGuild(interaction.guild.id);
		if(!g.enabled) lvlMess = 'На сервере отключена система уровней';
		else {
			const us = await getLevelUserByGuild(interaction.guild.id, _user.id);
			lvlMess = `Уровень: **${us.level}**\nXP: **${us.xp}**/**${MathNextLevel(us.level, g.xp.koeff)}**`
		}
		interaction.editReply(`${lvlMess}`)
	},
};
