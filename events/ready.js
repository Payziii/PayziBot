const { Events } = require('discord.js');
const { channels } = require('../config.js');
const BoticordService = require('../func/system/boticord.js');
const { GiveReward } = require('../func/system/upAdded.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`🤖 | Bot: ${client.user.username}`);
		client.channels.cache.get(channels.startLogs)
			.send(`<:Bot:732119152755474444> | **${client.user.username}** запущен с **${client.guilds.cache.size}** серверами`)

		if(!process.env.BOTICORD) return console.log('Boticord service is not loaded. Please add boticord token in .env file')
		
		const boticord = new BoticordService(process.env.BOTICORD);

		boticord.connect();

		boticord.on("notify", data => {
			GiveReward(data.user)
		})
	},
};