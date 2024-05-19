/* eslint-disable no-unused-vars */
const config = require('../../config.js');
const User = require('../../database/user.js');
const block = require('../../games_src/profile/block.json');

exports.run = async (client, message, args) => {
	const author = message.author.id;
	if (!config.owners.includes(author)) return;

	let u = await User.findOne({ userID: args[0] });
	if(!u) return message.reply('Пользователь не найден!');

	let block_level = parseInt(args[1]);
	u.block = block_level;
	u.save();

	message.reply(`Уровень \`${block[block_level].name}\` выдан пользователю <@${args[0]}> (${args[0]})`)
	
};
exports.help = {
	name: ',block',
	aliases: [',b', ',б', ',блок'],
	description: 'Выдать уровень блокировки пользователю',
};