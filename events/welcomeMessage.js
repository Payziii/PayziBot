const { Events } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member, client) {
		const guild = member.guild;
		const g = await Guild.findOne({ guildID: guild.id });
		if (!g) return;
		if (g.welcome.channelID == '-1') return;
		const channel = await client.channels.cache.get(g.welcome.channelID);
		if (channel.guild.id != guild.id) return;
		channel.send(g.welcome.welcomeText
			.replace('{user.mention}', member)
			.replace('{user.name}', member.user.username)
			.replace('{user.id}', member.id)
			.replace('{guild.name}', guild.name)
			.replace('{guild.memberCount}', guild.members.cache.filter(c => c.user.bot == false).size)
			.replace('{guild.botCount}', guild.members.cache.filter(c => c.user.bot == true).size)
			.replace('{guild.channelCount}', guild.channels.cache.size)
			.replace('{guild.boosts}', guild.premiumSubscriptionCount));
		if (g.welcome.autoRoleID == '-1') return;
		if (guild.roles.cache.get(g.welcome.autoRoleID) == undefined) return;
		member.roles.add(guild.roles.cache.get(g.welcome.autoRoleID)).then(() => {
			return;
		}).catch(() => {
			return;
		});
	},
};