const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Список команд'),
	async execute(interaction, guild) {
		await interaction.deferReply();
		const client = interaction.client;
		const embed = new EmbedBuilder()
			.setTitle('Список доступных команд')
			.setDescription('Бот использует слэш-команды. Для вызова команды введите `/команда`')
			.addFields(
				{
					name: 'Утилиты',
					value: `${Array.from(client.commands.filter(c => c.category === 'utility')).map(([key, value]) => `\`${key}\``).join(', ')}`,
				},
				{
					name: 'Модерация',
					value: `${Array.from(client.commands.filter(c => c.category === 'mod')).map(([key, value]) => `\`${key}\``).join(', ')}`,
				},
				{
					name: 'Настройка',
					value: `${Array.from(client.commands.filter(c => c.category === 'settings')).map(([key, value]) => `\`${key}\``).join(', ')}`,
				},
				{
					name: 'Игры и профиль',
					value: `${Array.from(client.commands.filter(c => c.category === 'games')).map(([key, value]) => `\`${key}\``).join(', ')}`,
				},
				{
					name: 'Система уровней',
					value: `${Array.from(client.commands.filter(c => c.category === 'levels')).map(([key, value]) => `\`${key}\``).join(', ')}`,
				},
				{
					name: 'Нейросети',
					value: `${Array.from(client.commands.filter(c => c.category === 'neuro')).map(([key, value]) => `\`${key}\``).join(', ')}`,
				},
			)
			.setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.webp?size=4096`)
			.setColor(guild.colors.basic)
			.setFooter({
				text: 'Больше информации на docs.payzibot.ru',
			});
		await interaction.editReply({ embeds: [embed] });
	},
};
