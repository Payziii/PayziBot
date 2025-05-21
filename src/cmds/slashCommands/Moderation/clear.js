const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { emojis, channels } = require('../../../config.js');

module.exports = {
	category: 'mod',
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Очистить сообщения в канале')
		.addIntegerOption((option) =>
			option
				.setName('количество')
				.setDescription('Количество сообщений, которые требуется очистить')
				.setMinValue(1)
				.setMaxValue(100)
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {
		await interaction.deferReply();
		const bot = await interaction.guild.members.me;
		if (bot.permissions.has('ManageMessages') == false) return interaction.editReply(`${emojis.error} | У меня нет прав для того, чтобы очищать сообщения...`);

		const count = interaction.options.getInteger('количество');
		interaction.channel.bulkDelete(count)
			.then(messages => {
				interaction.channel.send(`${emojis.success} | Очищено **${messages.size} сообщений** за последние 2 недели пользователем ${interaction.user}`);
			})
			.catch((err) => {
				client.channels.cache.get(channels.errorLogs).send(`Ошибка clear: \`\`\`js\n${err}\`\`\``);
				interaction.editReply(`${emojis.error} | Непредвиденная ошибка?`);
			});
	},
};
