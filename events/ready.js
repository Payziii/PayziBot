const { Events } = require('discord.js');
const { channels } = require('../config.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`| Бот: ${client.user.username}`);
		client.channels.cache.get(channels.startLogs)
			.send(`<:Bot:732119152755474444> | **${client.user.username}** запущен с **${client.guilds.cache.size}** серверами`)
	},
};