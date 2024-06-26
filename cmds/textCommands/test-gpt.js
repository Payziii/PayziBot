const { gpt4 } = require('../../func/system/freejourney.js');
const { emojis } = require("../../config.js");

exports.run = async (client, message, args) => {
  const text = args.join(" ");
  const data = await gpt4(text);
  console.log(data)
  if(!data.success) return message.reply(`${emojis.error} | Ошибка: \`${data.message}\``);

  let answer = data.data.completion;
  if (answer.length > 2000) {
    let mess = answer;
    mess = mess.substring(0, 1997);
    mess = mess + "...";
    return message.reply(mess);
  }else{
    message.reply(answer);
  }
};
exports.help = {
  name: "payzi",
  aliases: [],
  description: "Генерация текста через нейросети",
};
