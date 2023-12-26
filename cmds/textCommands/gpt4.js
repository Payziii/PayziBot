const RsnChat = require('rsnchat');
const rsnchat = new RsnChat('CHATGPT_gBYbmLjx3O');

exports.run = async (client, message, args) => {
	return message.reply('<:timeout_clock:1134453176091824250> | Команда будет доступна в 1.1.0');
	rsnchat.gpt(args.join(' '))
		.then(response => {
			if (!response.message) return message.reply('<:no:1107254682100957224> | Ответ не был получен!');
			if (response.message.length > 2000) {
				let mess = response.message;
				mess = mess.substring(0, 1997);
				mess = mess + '...';
				return message.reply(mess);
			}
			message.reply(response.message);
		}).catch(() => {
			message.reply('<:no:1107254682100957224> | Повторите свой запрос немного позже, возникли непредвиденные проблемы!');
		});
};
exports.help = {
	name: ',gpt4',
	aliases: [',chatgpt4', 'gpt4', 'гпт4', ',гпт4'],
	info: 'owner',
	usage: '[Команда]',
	perm: 'Developer',
	description: 'Выполнить код',
};