const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { emojis } = require('../../../config.js');

module.exports = {
	category: 'mod',
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Выдать мут пользователю')
		.addUserOption((option) =>
			option
				.setName('пользователь')
				.setDescription('Пользователь, которому нужно ограничить чат')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option.setName('время')
				.setDescription('Время мута')
				.setRequired(true)
				.addChoices(
					{ name: '1 мин.', value: 60000 },
					{ name: '10 мин.', value: 600000 },
					{ name: '30 мин.', value: 1800000 },
					{ name: '1 ч.', value: 3600000 },
					{ name: '2 ч.', value: 7200000 },
					{ name: '6 ч.', value: 21600000 },
					{ name: '12 ч.', value: 43200000 },
					{ name: '1 д.', value: 86400000 },
					{ name: '7 д.', value: 604800000 },
				))
		.addStringOption((option) =>
			option
				.setName('причина')
				.setDescription('Причина мута'),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
	async execute(interaction) {
		const user = interaction.options.getUser('пользователь');
		const bot = await interaction.guild.members.me;

		if (bot.permissions.has('ModerateMembers') == false) return interaction.reply(`${emojis.error} | У меня нет прав для мута пользователей`);
		let msg;
		let reason = interaction.options.getString('причина') || 'Причина отсутствует';
		const time = interaction.options.getInteger('время');
		let error = false;
		switch (user.id) {
		case interaction.guild.ownerId:
			error = true;
			msg = `${emojis.error} | Мне кажется это владелец сервера. Или мне кажется?`;
			break;
		case interaction.user.id:
			error = true;
			msg = `${emojis.error} | Я не хочу отправлять в мут таких людей`;
			break;
		case bot.id:
			error = true;
			msg = `${emojis.error} | А как я отвечу тебе после этого?`;
			break;
		default:
			msg = `${emojis.success} ${user} получил мут.\n-# Причина: ${reason}`;
		}
		reason = interaction.user.username + ': ' + reason;
		const member = await interaction.guild.members.cache.get(user.id);
		if (error != true) { member.timeout(time, reason); }
		interaction.reply(msg);
	},
};
