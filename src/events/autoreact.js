const { Events } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message, client) {
		try {
			// Проверяем на наличие канала в массиве каналов с отключенным автореактом
			if(client.autoreactChannels.includes(message.channel.id)) return;

			// Поиск сервера в базе данных
			const guild = await Guild.findOne({ guildID: message.guild.id });

			// Добавляем канал в массив каналов с отключенным автореактом
			if (!guild) return client.autoreactChannels.push(message.channel.id);
			if (guild.autoreact.channelID == '-1') return client.autoreactChannels.push(message.channel.id);
			if(message.channel.id != guild.autoreact.channelID) return client.autoreactChannels.push(message.channel.id);

			// Получение канала
			const channel = await client.channels.cache.get(guild.autoreact.channelID);
			if (!channel) return;

			// Проверка прав
			if (!channel.permissionsFor(message.guild.members.me).has(['AddReactions', 'ViewChannel'])) return;

			// Простановка реакций
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