const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`| Бот: ${client.user.tag}`);
        client.channels.cache.get('1115145596429406280')
              .send(`${client.user.tag} запущен с **${client.guilds.cache.size}** серверами`)
	},
};