const RsnChat = require('rsnchat');
const rsnchat = new RsnChat(process.env.RSN);

exports.run = async (client, message, args) => {

	try {
	message.reply(`<a:loading:673777314584199169> | Ожидаем ответа...`).then(async (msg) => {

	let text1 = args.join(' ');
	let text = text1.replace('--gpt', '').replace('--gemini', '').replace('--llama', '')

	let model;

	if(text1.endsWith('--llama')) model = 'llama'
	else if(text1.endsWith('--gemini')) model = 'gemini'
	else model = 'gpt'

	if (model === 'gpt') {
		await rsnchat.gpt(text)
		  .then(response => {
			res = response.message
		  }).catch(() => {
			return msg.edit('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже!')
		  });
	  } else if (model === 'gemini') {
		await rsnchat.gemini(text)
		  .then(response => {
			res = response.message
		  }).catch(() => {
			return msg.edit('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже!')
		  });
	  } else {
		await rsnchat.llama(text)
		  .then(response => {
			res = response.message
		  }).catch(() => {
			return msg.edit('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже!')
		  });
	  }
  
	  if (!res) return msg.edit('<:no:1107254682100957224> | Ответ не был получен!');
			  if (res.length > 2000) {
				  let mess = res;
				  mess = mess.substring(0, 1997);
				  mess = mess + '...';
				  return msg.edit(mess);
			  }
			  msg.edit(res);

			})
			}catch(err) {
				console.log(err)
			}
};
exports.help = {
	name: ',ask',
	aliases: [',chatgpt4', 'gpt4', 'гпт4', ',гпт4', 'gpt4'],
	info: 'owner',
	usage: '[Команда]',
	perm: 'Developer',
	description: 'Выполнить код',
};