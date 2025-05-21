const { Events } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message, client) {
		try {
			if(client.autoreactChannels.includes(message.channel.id)) return; // Проверяем на наличие канала в массиве каналов с отключенным автореактом
			const guild = await Guild.findOne({ guildID: message.guild.id });
			if (!guild) return client.autoreactChannels.push(message.channel.id); // Добавляем в массив
			if (guild.autoreact.channelID == '-1') return client.autoreactChannels.push(message.channel.id); // Добавляем в массив

			if(message.channel.id != guild.autoreact.channelID) return client.autoreactChannels.push(message.channel.id); // Добавляем в массив

			const channel = await client.channels.cache.get(guild.autoreact.channelID); // Получаем канал
			if (!channel) return; // И возвращаем return, если его не существует
			if (!channel.permissionsFor(message.guild.members.me).has(['AddReactions', 'ViewChannel'])) return; // Проверяем, есть ли у бота права

			const reacts = await guild.autoreact.reacts; 
			for (const reaction of reacts) { // Ставим реакции через цикл for
				message.react(reaction);
			}
		}
		catch (error) {
			console.log(error);
		}

	},
};