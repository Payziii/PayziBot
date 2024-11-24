const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const create = require('../../../func/levelCard.js')
const User = require('../../../database/user.js');
const block = require('../../../games_src/profile/block.json');
const ach = require('../../../games_src/profile/achievements.json');
const { emojis } = require('../../../config.js');
const fs = require('fs').promises;
const { join } = require('path')
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
		if(!g.enabled) return interaction.editReply('На сервере отключена система уровней');
		
			const us = await getLevelUserByGuild(interaction.guild.id, _user.id);
			lvlMess = `Уровень: **${us.level}**\nXP: **${us.xp}**/**${MathNextLevel(us.level, g.xp.koeff)}**`
		prosh = MathNextLevel(us.level-1, g.xp.koeff)
		if(prosh<0) prosh = 0 
		prog = (us.xp - prosh)/(MathNextLevel(us.level, g.xp.koeff)-prosh)
		avatar = _user.displayAvatarURL({ extension: 'jpg' })
		canvas = await create(_user.username, us.level, prog, avatar)
		img = await canvas.encode('png')
		await fs.writeFile(join(__dirname, 'simple.png'), img)
		interaction.editReply(`${lvlMess}`, { files: [{
			attachment: join(__dirname, 'simple.png'),
			name: 'example.png'
		}] }).then(async () => {
			// Удаление файла после успешной отправки
			await fs.unlink(join(__dirname, 'simple.png'))})
	},
};
