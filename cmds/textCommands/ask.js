const { RsnChat } = require('rsnchat');
const rsnchat = new RsnChat(process.env.RSN);

exports.run = async (client, message, args) => {

	message.reply(`<a:loading:673777314584199169> | Ожидаем ответа...`).then(async (msg) => {

	let text1 = args.join(' ');
	let text = text1.replace('--gpt', '').replace('--gemini', '').replace('--llama', '').replace('--гемини', '').replace('--ллама', '').replace('--mixtral', '').replace('--codellama', '').replace('--cl', '')

	let model;
	let suc = true;

	if(text1.endsWith('--llama') || text1.endsWith('--ллама')) model = 'llama'
	else if(text1.endsWith('--gemini') || text1.endsWith('--гемини')) model = 'gemini'
	else if(text1.endsWith('--mixtral')) model = 'mixtral'
	else if(text1.endsWith('--codellama') || text1.endsWith('--cl')) model = 'codellama'
	else model = 'gpt'

	if (model === 'gpt') {
		await rsnchat.gpt(text)
		  .then(response => {
			res = response.message
		  }).catch(() => {
			msg.edit('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
			return suc = false;
		  });
	  } else if (model === 'gemini') {
		await rsnchat.gemini(text)
		  .then(response => {
			res = response.message
		  }).catch(() => {
			msg.edit('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
			return suc = false;
		  });
	  } else if (model === 'mixtral') {
		await rsnchat.mixtral(text)
		  .then(response => {
			res = response.message
		  }).catch(() => {
			msg.edit('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
			return suc = false;
		  });
	  } else if (model === 'codellama') {
		await rsnchat.codellama(text)
		  .then(response => {
			res = response.message
		  }).catch(() => {
			msg.edit('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
			return suc = false;
		  });
	  } else {
		await rsnchat.llama(text)
		  .then(response => {
			res = response.message
		  }).catch(() => {
			msg.edit('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
			return suc = false;
		  });
	  }

	  if(!suc) return;
	  if (!res) return msg.edit('<:no:1107254682100957224> | Ответ не был получен!');
			  if (res.length > 2000) {
				  let mess = res;
				  mess = mess.substring(0, 1997);
				  mess = mess + '...';
				  return msg.edit(mess);
			  }
			  msg.edit(res);

			})
};
exports.help = {
	name: ',ask',
	aliases: [',chatgpt4', 'gpt4', 'гпт4', ',гпт4', 'gpt4', "гпт", ",гпт", "gpt", ",gpt"],
	info: 'owner',
	usage: '[Команда]',
	perm: 'Developer',
	description: 'Выполнить код',
};