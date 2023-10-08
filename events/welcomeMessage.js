const { Events, EmbedBuilder } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member, client) {
        let guild = member.guild;
        let g = await Guild.findOne({ guildID: guild.id });
        if(!g) return;
        if(g.welcome.channelID == '-1') return;
        let channel = await client.channels.cache.get(g.welcome.channelID);
        if(channel.guild.id != guild.id) return;
        channel.send(g.welcome.welcomeText.replace('{user.mention}', member).replace('{user.name}', member.user.username).replace('{user.id}', member.id).replace('{guild.name}', guild.name))
    }
};