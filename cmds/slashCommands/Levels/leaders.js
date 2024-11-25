const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const User = require('../../../database/user.js');
const block = require('../../../games_src/profile/block.json');
const ach = require('../../../games_src/profile/achievements.json');
const { emojis } = require('../../../config.js');
const { getLevelGuild, getLevelUserByGuild, MathNextLevel } = require('../../../database/levels.js');

module.exports = {
	category: 'levels',
	data: new SlashCommandBuilder()
		.setName('leaders')
		.setDescription('Посмотреть список лидеров'),
	async execute(interaction, guild) {
		await interaction.deferReply();
		const allowedMentions = { parse: ['users'], repliedUser: false };
		const g = await getLevelGuild(interaction.guild.id);
		let lvlMess = "";
		if(!g.enabled) lvlMess = 'На сервере отключена система уровней';
		const users = g.data;
		users.sort((a, b) => b.xp - a.xp);
		const top10Users = users.slice(0, 10);
		let myPos = 0;
		top10Users.forEach((user, index) => {
			if(user.user == interaction.user.id) myPos = index+1;
			lvlMess = lvlMess+`${index + 1}. <@${user.user}> — Уровень: **${user.level}** — XP: **${user.xp}**\n`;
		  });
		if(myPos != 0) lvlMess += `\n➡️ У Вас: ${myPos} место`
		interaction.editReply(`${lvlMess}`, { allowedMentions })
	},
};
