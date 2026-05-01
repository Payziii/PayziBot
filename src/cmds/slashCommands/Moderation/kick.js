const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { emojis } = require('../../../config.js');

module.exports = {
	category: 'mod',
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Исключить пользователя с сервера')
		.addUserOption((option) =>
			option
				.setName('пользователь')
				.setDescription('Пользователь, которого нужно исключить')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('причина')
				.setDescription('Причина исключения'),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('пользователь');
		const bot = await interaction.guild.members.me;

		if (bot.permissions.has('KickMembers') == false) return interaction.reply(`${emojis.error} | Для исключения пользователя мне необходимо иметь право \`Выгонять участников\`!`);
		let msg;
		let reason = interaction.options.getString('причина') || 'Причина отсутствует';
		let error = false;
		switch (user.id) {
		case interaction.guild.ownerId:
			error = true;
			msg = `${emojis.error} | Я не могу выгнать владельца сервера...`;
			break;
		case interaction.user.id:
			error = true;
			msg = `${emojis.error} | Я не могу выгнать вас с сервера`;
			break;
		case bot.id:
			error = true;
			msg = `${emojis.error} | А может я не хочу выходить с этого прекрасного сервера!`;
			break;
		default:
			msg = `${emojis.success} ${user} был выгнан...\n-# Причина: ${reason}`;
		}
		reason = interaction.user.username + ': ' + reason;
		const member = await interaction.guild.members.cache.get(user.id);
		if (error != true) {
			member.kick({ reason: reason })
				.then(() => interaction.reply(msg))
				.catch(() => interaction.reply(`${emojis.error} | Кажется я не могу выгнать этого пользователя...`));
		}
		else {
			interaction.reply(msg);
		}
	},
};
