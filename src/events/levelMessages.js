const { Events } = require('discord.js');
const { getLevelGuild, getLevelUserByGuild, MathNextLevel, putLevelUser, getRoleByLevelAndGuild } = require('../database/levels.js');
const { randomIntFromInterval } = require('../func/random.js');
const { CheckAch } = require('../func/games/giveAch.js');

function giveRole(message, role, level) {
	if (role == undefined) return;
	if (message.guild.members.cache.get(message.author.id).roles.cache.has(role.id)) return;
	const bot = message.guild.members.me;
	if (role.rawPosition >= bot.roles.highest.rawPosition) return;
	if (bot.permissions.has('ManageRoles') == false) return;
	if (role.tags?.botId) return;
	if (role.tags?.premiumSubscriberRole) return;
	if (role.tags?.integrationId || role.managed) return;
	console.log(2)
	message.guild.members.cache.get(message.author.id).roles.add(role, `Роль за ${level} уровень`).then(() => {
		return;
	}).catch(() => {
		return;
	});
}
module.exports = {
	name: Events.MessageCreate,
	async execute(message, client) {
		if (message.author.bot) return; // Ботов не обслуживаем

		const guild = await getLevelGuild(message.guild.id);
		if (!guild.enabled) return; // Дальше только сервера с включенной лвл-системой
		const user = await getLevelUserByGuild(message.guild.id, message.author.id);
		if (message.createdTimestamp - user.lastMessage < guild.interval * 1000) return; // Проверяем, прошло ли нужное количество времени между сообщениями
		console.log(user)
		const xpToAdd = randomIntFromInterval(guild.xp.min, guild.xp.max); // Получаем количество xp, необходимые для выдачи
		if (MathNextLevel(user.level, guild.xp.koeff) <= user.xp + xpToAdd) {
			user.level++;
			if (user.level >= 100) CheckAch(12, message.author.id, message.channel)
			if (guild.messageEnabled) {
				if (guild.channelID === '-1') {
					message.channel.send(guild.message.replace('{user.mention}', message.author)
						.replace('{user.name}', message.author.username)
						.replace('{user.id}', message.author.id)
						.replace('{guild.name}', message.guild.name)
						.replace('{level}', user.level)
						.replace('{xp}', user.xp)
					)
				}
			}

			if (guild.roles.length > 0) {
				console.log(1)
				const roleId = await getRoleByLevelAndGuild(message.guild.id, user.level)
				const role = message.guild.roles.cache.get(roleId)
				console.log(role)
				giveRole(message, role, user.level)
			}
		}
		user.xp += xpToAdd;
		user.lastMessage = message.createdTimestamp;
		console.log(user)
		putLevelUser(message.guild.id, user)

	}
};