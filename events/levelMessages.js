const { Events } = require('discord.js');
const { getLevelGuild, getLevelUserByGuild, MathNextLevel, putLevelUser } = require('../database/levels.js');
const { randomIntFromInterval } = require('../func/random.js');
const { CheckAch } = require('../func/games/giveAch.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message, client) {
		return; // Не работает
		if (message.author.bot) return; // Ботов не обслуживаем

		const guild = await getLevelGuild(message.guild.id);
		if(!guild.enabled) return; // Дальше только сервера с включенной лвл-системой
		const user = await getLevelUserByGuild(message.guild.id, message.author.id);
		if(message.createdTimestamp-user.lastMessage < guild.interval*1000) return; // Проверяем, прошло ли нужное количество времени между сообщениями
console.log(user)
		const xpToAdd = randomIntFromInterval(guild.xp.min, guild.xp.max); // Получаем количество xp, необходимые для выдачи
		if(MathNextLevel(user.level, guild.xp.koeff) <= user.xp+xpToAdd) {
			user.level++;
			if(guild.messageEnabled) {
				if(guild.channelID === '-1') {
					message.channel.send(guild.message.replace('{user.mention}', message.author)
					.replace('{user.name}', message.author.username)
					.replace('{user.id}', message.author.id)
					.replace('{guild.name}', message.guild.name)
					.replace('{level}', user.level)
					)
				}
			}
		}
		user.xp+=xpToAdd;
		user.lastMessage = message.createdTimestamp;
		console.log(user)
		putLevelUser(message.guild.id, user)

	}
};