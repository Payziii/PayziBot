// ВРЕМЕННАЯ КОМАНДА
exports.run = async (client, message, args, guild) => {
	message.reply('Ваша заявка отправлена')
	client.channels.cache.get("1137366763177267261")
			.send(`Сервер: ${message.guild.name}\nID: ${message.guild.id}\nАвтор: ${message.guild.members.cache.get(message.author.id).user.username} (${message.author.id})`)
};
exports.help = {
	name: ',rec',
	aliases: [',рек'],
	info: 'owner',
	usage: '[Команда]',
	perm: 'Developer',
	description: 'Выполнить код',
};