const { Events } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		const guild = await Guild.findOne({ guildID: message.guild.id });
		if (!guild) return;
		if (guild.customCommands.size < 1) return;
		if (guild.customCommands.has(message.content) == false) return;
		const command = await guild.customCommands.get(message.content);
		// Можно добавлять очень много критерий для выполнения, например:
		// if(command.allowUsers && command.allowUsers.length > 0) {
		//   if(command.allowUsers[0] != 'everyone' || command.allowUsers.includes(message.author.id) == false) return;
		// }
		// В данном примере команда приватна и может выполниться только определёнными пользователями
		if (command.allowUsers && command.allowUsers.length > 0) {
			if (command.allowUsers[0] != 'everyone' || command.allowUsers.includes(message.author.id) == false) return;
		}
		if (!command.reply) return;
		const answer = command.reply
			.replace('{user.mention}', message.author)
			.replace('{user.name}', message.author.username)
			.replace('{user.id}', message.author.id)
			.replace('{guild.name}', message.guild.name)
			.replace('{guild.memberCount}', message.guild.members.cache.filter(c => c.user.bot == false).size)
			.replace('{guild.botCount}', message.guild.members.cache.filter(c => c.user.bot == true).size)
			.replace('{guild.channelCount}', message.guild.channels.cache.size)
			.replace('{guild.boosts}', message.guild.premiumSubscriptionCount);
		message.reply(answer);
	},
};