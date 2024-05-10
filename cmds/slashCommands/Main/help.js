const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Список команд'),
	async execute(interaction, guild) {
		const embed = new EmbedBuilder()
			.setTitle('Список доступных команд')
			.setDescription('Бот использует слэш-команды. Для вызова команды введите `/команда`')
			.addFields(
				{
					name: 'Утилиты',
					value: '`help`, `avatar`, `userinfo`, `stats`, `translate`, `weather`, `github`, `serverinfo`',
				},
				{
					name: 'Модерация',
					value: '`ban`, `kick`, `mute`, `unmute`, `channel`, `clear`',
				},
				{
					name: 'Настройка',
					value: '`configuration`, `starboard`, `autoreact`, `welcome`, `goodbye`, `rolereact`',
				},
				{
					name: 'Игры и профиль',
					value: '`profile`, `bio`, `guess`, `minesweeper`, `ttt`, `colorfield`, `hangman`, `snake`, `memory`, `2048`',
				},
				{
					name: 'Нейросети',
					value: '`image`, `ask`',
				},
			)
			.setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.webp?size=4096`)
			.setColor(guild.colors.basic)
			.setFooter({
				text: 'Больше информации на docs.payzibot.ru',
			});
		await interaction.reply({ embeds: [embed] });
	},
};
