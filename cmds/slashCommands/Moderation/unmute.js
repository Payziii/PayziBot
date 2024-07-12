const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { emojis } = require('../../../config.js');

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Размутить пользователя')
		.addUserOption((option) =>
			option
				.setName('пользователь')
				.setDescription('Пользователь, которого нужно размутить')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('причина')
				.setDescription('Причина размута'),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('пользователь');
		const bot = await interaction.guild.members.me;

		if (bot.permissions.has('ModerateMembers') == false) return interaction.reply(`${emojis.error} | У меня нет прав для размута пользователей`);
		let msg;
		let reason = interaction.options.getString('причина') || 'Причина отсутствует';
		let error = false;
		switch (user.id) {
		case interaction.guild.ownerId:
			error = true;
			msg = `${emojis.error} | Это случаем не владелец сервера?`;
			break;
		case interaction.user.id:
			error = true;
			msg = `${emojis.error} | А как ты это пишешь, если ты в муте?`;
			break;
		case bot.id:
			error = true;
			msg = `${emojis.error} | А как я это пишу?`;
			break;
		default:
			msg = `${emojis.success} ${user} был размучен.\n-# Причина: ${reason}`;
		}
		reason = interaction.user.username + ': ' + reason;
		const member = await interaction.guild.members.cache.get(user.id);
		if (error != true) { member.timeout(null, reason); }
		interaction.reply(msg);
	},
};
