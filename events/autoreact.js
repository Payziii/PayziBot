const { Events } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message, client) {
		try {
			const guild = await Guild.findOne({ guildID: message.guild.id });
			if (!guild) return;
			if (guild.autoreact.channelID == '-1') return;

			const channel = await client.channels.cache.get(guild.autoreact.channelID);
			if (!channel) return;
			if (channel.id != message.channel.id) return;

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