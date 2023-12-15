const { Events, EmbedBuilder } = require('discord.js');
const Guild = require('../database/guild.js');
const { CheckAch } = require('../func/games/giveAch.js');

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(react) {
		if (react.message.partial) await react.message.fetch();
		if (react.partial) await react.fetch();
		const guild = await Guild.findOne({ guildID: react.message.guild.id });
		if (!guild) return;
		const customReact = guild.starboard.customReact;
		if (react.emoji.name != customReact) return;
		if (guild.starboard.channelID == '-1') return;
		if (react.count < guild.starboard.reqReacts) return;
		const messageAttachment = react.message.attachments.size > 0 ? Array.from(react.message.attachments.values())[0].url : null;

		const embed = new EmbedBuilder()
			.setAuthor({
				name: react.message.author.username,
				iconURL: react.message.author.displayAvatarURL(),
			})
			.setColor(guild.colors.starboard)
			.setImage(messageAttachment);
		const content = react.message.content.replaceAll(' ', '');
		if (content.length > 0) embed.setDescription(react.message.content || 'Пустое сообщение');
		const msg = guild.starboard.data.get(react.message.id);
		let reactMsg;
		if (/\p{Emoji}/u.test(customReact) == false) {
			if (react.message.guild.emojis.cache.find(emoji => emoji.name === customReact) == undefined) return;
			const reactId = react.message.guild.emojis.cache.find(emoji => emoji.name === customReact).id;
			reactMsg = `<:${customReact}:${reactId}>`;
		}
		else {
			reactMsg = customReact;
		}
		if (msg == undefined) {
			react.message.guild.channels.cache.get(guild.starboard.channelID).send({ content: `${reactMsg} **${react.count}:** ${react.message.url}`, embeds: [embed] })
				.then(message => {
					guild.starboard.data.set(react.message.id, message.id);
					guild.save();
					CheckAch(4, react.message.author.id, react.message.channel)
				})
				.catch(e => console.log(e));
		}
		else {
			react.message.guild.channels.cache.get(guild.starboard.channelID).messages.cache.get(msg).edit({ content: `${reactMsg} **${react.count}:** ${react.message.url}`, embeds: [embed] })
				.catch(e => console.log(e));
		}
	},
};