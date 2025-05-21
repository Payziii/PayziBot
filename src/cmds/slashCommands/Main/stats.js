const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const os = require('os');
const time = require('payzi-time');
const { version } = require('../../../../package.json');
const { emojis } = require('../../../config.js');
const plural = require('../../../func/plural.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Информация о боте'),
	async execute(interaction, guild) {
		await interaction.deferReply();
		const client = interaction.client;
		const uptime = time(client.uptime);
		const { days, hours, minutes, seconds } = uptime;
		const bremya = days > 0 ? `${days} д. ${hours} ч. ${minutes} м.` :
			hours > 0 ? `${hours} ч. ${minutes} м.` :
				minutes > 0 ? `${minutes} м. ${seconds} сек.` :
					`${seconds} сек.`;
		const embed = new EmbedBuilder()
			.setTitle(`PayziBot ${version}`)
			.setDescription(`${emojis.arrow} Бот работает: **${bremya}**\n${emojis.arrow} За день ${plural(client.cmdsUsed, "использована", "использовано", "использовано")} **${client.cmdsUsed} ${plural(client.cmdsUsed, "команда", "команды", "команд")}**`)
			.addFields(
				{
					name: 'Статистика',
					value: `Серверов: **${client.guilds.cache.size}**\nКаналов: **${client.channels.cache.size}**\nПользователей: **${client.users.cache.size}**`,
				},
				{
					name: 'Хостинг',
					value: `ОЗУ: \`${(process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(0)} МБ\`/\`${(os.totalmem() / (1024 * 1024)).toFixed(0)} МБ\`\nWebSocket: \`${client.ws.ping}ms\`\nЦП: \`${os.cpus()[0].model}\``,
				},
			)
			.setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.webp?size=4096`)
			.setColor(guild.colors.basic);
		const links = new EmbedBuilder()
			.setTitle('Ссылки')
			.setDescription(`${emojis.arrow} [Сервер поддержки](https://discord.gg/E7SFuVEB2Z)\n${emojis.arrow} [Добавить бота](https://discord.com/api/oauth2/authorize?client_id=576442351426207744&permissions=1411299798102&scope=bot)\n${emojis.arrow} [Документация](https://docs.payzibot.ru/)\n${emojis.arrow} [Исходный код](https://github.com/Payziii/PayziBot/)\n\n${emojis.arrow} [PayziBot на BotiCord](https://boticord.top/bot/payzibot)`)
			.setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.client.user.id}/${interaction.client.user.avatar}.webp?size=4096`)
			.setColor(guild.colors.basic);
		const link_button = new ButtonBuilder()
			.setCustomId('link_button')
			.setLabel('Ссылки')
			.setStyle(ButtonStyle.Secondary);
		const row = new ActionRowBuilder()
			.addComponents(link_button);

		const response = await interaction.editReply({ embeds: [embed], components: [row] });
		const collectorFilter = i => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

			if (confirmation.customId === 'link_button') {
				await interaction.editReply({ embeds: [links], components: [] });
			}

		}
		catch (e) {
			if (e.message.includes('messageDelete')) return;
			await interaction.editReply({ embeds: [embed], components: [] });
		}
	},
};
