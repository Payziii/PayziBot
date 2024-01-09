const { Events } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(react) {
		if (react.message.partial) await react.message.fetch();
		if (react.partial) await react.fetch();
		const guild = await Guild.findOne({ guildID: react.message.guild.id });
		if (!guild) return;
	},
};