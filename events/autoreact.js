const { Events, EmbedBuilder } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message, client) {
    try {
      let guild = await Guild.findOne({ guildID: message.guild.id });
    if(!guild) return;
    if(guild.autoreact.channelID == '-1') return;

    let channel = await client.channels.cache.get(guild.autoreact.channelID);
    if(!channel) return;
    if(channel.id != message.channel.id) return;

    let reacts = await guild.autoreact.reacts;
    for(reaction of reacts) {
      message.react(reaction)
      }
    }
    catch(error) {
      console.log(error)
    }

    }
};