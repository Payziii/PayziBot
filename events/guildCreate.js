const { Events, EmbedBuilder } = require('discord.js');
const { channels } = require('../config.js');

module.exports = {
	name: Events.GuildCreate,
	async execute(guild, client) {
		const embed = new EmbedBuilder()
			.setTitle('Новый сервер')
			.setDescription(`Название: **${guild.name}**\nУчастников: **${guild.memberCount}**\nВладелец: **${guild.members.cache.get(guild.ownerId).user.username}** (${guild.ownerId})\n\nСервер создан: <t:${(guild.createdTimestamp / 1000).toFixed(0)}:D> (<t:${(guild.createdTimestamp / 1000).toFixed(0)}:R>)`)
			.setColor('#3fcc65')
			.setFooter({
				text: `ID: ${guild.id}`,
			});
		if (guild.members.me.permissions.has('SendMessages')) {
			const channel = await guild.channels.cache.find(channel => channel.isTextBased())

			const embed = new EmbedBuilder()
				.setTitle("Спасибо, что добавили меня на сервер!")
				.setDescription("Чтобы посмотреть список команд, введите: `/help`\n\nЕсли у вас возникли вопросы или появились проблемы, обратитесь на [сервер поддержки](https://discord.gg/E7SFuVEB2Z)\n\nПодробное описание команд и функций вы можете найти в [документации](https://docs.payzibot.ru/)")
				.setColor("#3fcc65")
				.setFooter({
					text: "Сообщение отправлено, поскольку бот был добавлен на сервер",
				});

			await channel.send({ embeds: [embed] });
		}
		client.channels.cache.get(channels.serverLogs)
			.send({ embeds: [embed] });
	},
};