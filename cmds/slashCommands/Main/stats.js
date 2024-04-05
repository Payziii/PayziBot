const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const os = require('os');
const time = require('payzi-time');
const { version } = require('../../../package.json');
const changelog = require('../../../changelog.js');
const { CheckAch } = require('../../../func/games/giveAch.js');
const { emojis } = require('../../../config.js');
const plural = require('../../../func/plural.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Информация о боте'),
	async execute(interaction, guild) {
		await interaction.deferReply();
		const client = interaction.client;
		const uptime = time(client.uptime);
		let bremya;
		if (uptime.minutes === 0 && uptime.hours === 0 && uptime.days === 0) bremya = `${uptime.seconds} сек.`;
		else if (uptime.hours === 0 && uptime.days === 0) bremya = `${uptime.minutes} м. ${uptime.seconds} сек.`;
		else if (uptime.days === 0) bremya = `${uptime.hours} ч. ${uptime.minutes} м.`;
		else bremya = `${uptime.days} д. ${uptime.hours} ч. ${uptime.minutes} м.`;
		const embed = new EmbedBuilder()
			.setTitle(`PayziBot ${version}`)
			.setDescription(`${emojis.arrow} Бот работает: **${bremya}**\n${emojis.arrow} С момента включения использовано: **${client.cmdsUsed} ${plural(client.cmdsUsed, "команда", "команды", "команд")}**`)
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
			.setThumbnail('https://cdn.discordapp.com/avatars/732867965053042690/f3f976adc4cb628dd707a8f4203e1f5d.webp?size=4096')
			.setColor(guild.colors.basic);
		const links = new EmbedBuilder()
			.setTitle('Ссылки')
			.setDescription(`${emojis.arrow} [Сервер поддержки](https://discord.gg/E7SFuVEB2Z)\n
			${emojis.arrow} [Добавить бота](https://discord.com/api/oauth2/authorize?client_id=576442351426207744&permissions=1411299798102&scope=bot)\n
			${emojis.arrow} [Документация](https://docs.payzibot.ru/)\n
			${emojis.arrow} [Исходный код](https://github.com/Payziii/PayziBot/)\n\n
			${emojis.arrow} [PayziBot на BotiCord](https://boticord.top/bot/payzibot)`)
			.setThumbnail('https://cdn.discordapp.com/avatars/732867965053042690/f3f976adc4cb628dd707a8f4203e1f5d.webp?size=4096')
			.setColor(guild.colors.basic);
		const link_button = new ButtonBuilder()
			.setCustomId('link_button')
			.setLabel('Ссылки')
			.setStyle(ButtonStyle.Secondary);
		const change_button = new ButtonBuilder()
			.setCustomId('change_button')
			.setLabel('Изменения')
			.setStyle(ButtonStyle.Secondary);
		const row = new ActionRowBuilder()
			.addComponents(link_button, change_button);

		const response = await interaction.editReply({ embeds: [embed], components: [row] });
		const collectorFilter = i => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

			if (confirmation.customId === 'link_button') {
				await interaction.editReply({ embeds: [links], components: [] });
			}
			else if (confirmation.customId === 'change_button') {
				CheckAch(7, interaction.user.id, interaction.channel)
				const text = `# ${changelog.version}\n\n## Добавлено\n\n- ${changelog.added.join('\n- ')}\n\n## Изменено\n\n- ${changelog.changed.join('\n- ')}\n\n## Исправлено\n\n- ${changelog.fixed.join('\n- ')}`
				await interaction.editReply({ content: text, embeds: [], components: [] });
			}

		}
		catch (e) {
			if (e.message.includes('messageDelete')) return;
			await interaction.editReply({ embeds: [embed], components: [] });
		}
	},
};
