const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { emojis } = require('../../../config.js');

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Блокировка пользователя')
		.addUserOption((option) =>
			option
				.setName('пользователь')
				.setDescription('Пользователь, которого нужно заблокировать')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('причина')
				.setDescription('Причина блокировки'),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('пользователь');
		const bot = await interaction.guild.members.me;

		if (bot.permissions.has('BanMembers') == false) return interaction.reply(`${emojis.error} | У меня нет прав для блокировки пользователей`);
		let msg;
		let reason = interaction.options.getString('причина') || 'Причина отсутствует';
		let error = false;
		switch (user.id) {
		case interaction.guild.ownerId:
			error = true;
			msg = `${emojis.error} | Вы не можете заблокировать владельца сервера`;
			break;
		case interaction.user.id:
			error = true;
			msg = `${emojis.error} | Вы не можете заблокировать лучшего человека на этом сервере`;
			break;
		case bot.id:
			error = true;
			msg = `${emojis.error} | Как я заблокирую самого себя?`;
			break;
		default:
			msg = `${emojis.success} ${user} был заблокирован. Причина: ${reason}`;
		}
		reason = interaction.user.username + ': ' + reason;
		const member = await interaction.guild.members.cache.get(user.id);
		if (error != true) {
			member.ban({ reason: reason })
				.then(() => interaction.reply(msg))
				.catch(() => interaction.reply(`${emojis.error} | Кажется я не могу заблокировать этого пользователя...`));
		}
		else {
			interaction.reply(msg);
		}
	},
};
