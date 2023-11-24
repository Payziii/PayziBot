const { Events, EmbedBuilder } = require('discord.js');
const { channels } = require('../config.js');

module.exports = {
	name: Events.GuildCreate,
	async execute(guild, client) {
		const embed = new EmbedBuilder()
			.setTitle('Новый сервер')
			.setDescription(`Название: **${guild.name}**\nУчастников: **${guild.memberCount}**\n\nСервер создан: <t:${(guild.createdTimestamp / 1000).toFixed(0)}:D> (<t:${(guild.createdTimestamp / 1000).toFixed(0)}:R>)`)
			.setColor('#3fcc65')
			.setFooter({
				text: `ID: ${guild.id}`,
			});

		client.channels.cache.get(channels.serverLogs)
			.send({ embeds: [embed] });
	},
};