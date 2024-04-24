/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const User = require('../../database/user.js');

exports.run = async (client, message, args, guild, user) => {
	const author = message.author.id;
	if (!config.owners.includes(author)) return;

	let u = await User.findOne({ userID: args[0] });
	if(!u) return message.reply('Пользователь не найден!');

	u.block = parseInt(args[1]);
	u.save();

	message.reply('Готово!')
	
};
exports.help = {
	name: ',block',
	aliases: [',b', ',б', ',блок'],
	description: 'Выдать уровень блокировки пользователю',
};