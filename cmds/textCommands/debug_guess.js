const { EmbedBuilder } = require('discord.js')

exports.run = async (client, message, args, guild, user) => {
	return message.reply('g:battery:')
	
	function sleep(milliseconds) {
		const date = Date.now();
		let currentDate = null;
		do {
		  currentDate = Date.now();
		} while (currentDate - date < milliseconds);
	  }

	  const game = require('../../games_scr/logo.json');

	  for(i = 0; i <= game.length; i++) {
		item = game[i];

		const embed = new EmbedBuilder()
  .setDescription(`${item.id} - ${item.answers[0]}`)
  .setImage(item.image);

await message.reply({ embeds: [embed] });
sleep(100)
	  }
};
exports.help = {
	name: ',g-d',
	aliases: [',gues-debug'],
	info: 'owner',
	usage: '[Команда]',
	perm: 'Developer',
	description: 'Выполнить код',
};