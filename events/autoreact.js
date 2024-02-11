const { Events } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message, client) {
		try {
			if(client.autoreactChannels.includes(message.channel.id)) return;
			const guild = await Guild.findOne({ guildID: message.guild.id });
			if (!guild) return client.autoreactChannels.push(message.channel.id);
			if (guild.autoreact.channelID == '-1') return client.autoreactChannels.push(message.channel.id);

			if(message.channel.id != guild.autoreact.channelID) return;

			const channel = await client.channels.cache.get(guild.autoreact.channelID);
			if (!channel) return;

			const reacts = await guild.autoreact.reacts;
			for (const reaction of reacts) {
				message.react(reaction);
			}
		}
		catch (error) {
			console.log(error);
		}

	},
};