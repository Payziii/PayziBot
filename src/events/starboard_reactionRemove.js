const { Events, EmbedBuilder } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.MessageReactionRemove,
	async execute(react) {
		if (react.message.partial) await react.message.fetch();
		if (react.partial) await react.fetch();
		const guild = await Guild.findOne({ guildID: react.message.guild.id });
		if (!guild) return;
		const customReact = guild.starboard.customReact;
		if (react.emoji.name != customReact) return;
		if (guild.starboard.channelID == '-1') return;
		if (react.count < guild.starboard.reqReacts) {
			const msg = guild.starboard.data.get(react.message.id);
			if (msg == undefined) return;
			const deleted_msg = await react.message.guild.channels.cache.get(guild.starboard.channelID).messages.cache.get(msg);
			if (!deleted_msg) return;
			deleted_msg.delete()
				.catch(e => console.log(e));
			guild.starboard.data.delete(react.message.id);
			guild.save();
			return;
		}
		let reactMsg;
		if (/\p{Emoji}/u.test(customReact) == false) {
			if (react.message.guild.emojis.cache.find(emoji => emoji.name === customReact) == undefined) return;
			const reactId = react.message.guild.emojis.cache.find(emoji => emoji.name === customReact).id;
			reactMsg = `<:${customReact}:${reactId}>`;
		}
		else {
			reactMsg = customReact;
		}
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
		if (msg == undefined) {
			react.message.guild.channels.cache.get(guild.starboard.channelID).send({ content: `${reactMsg} **${react.count}:** ${react.message.url}`, embeds: [embed] })
				.then(message => {
					guild.starboard.data.set(react.message.id, message.id);
					guild.save();
				})
				.catch(e => console.log(e));
		}
		else {
			react.message.guild.channels.cache.get(guild.starboard.channelID).messages.cache.get(msg).edit({ content: `${reactMsg} **${react.count}:** ${react.message.url}`, embeds: [embed] })
				.catch(e => console.log(e));
		}
	},
};