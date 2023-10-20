const { Events, EmbedBuilder } = require('discord.js');
const Guild = require('../database/guild.js');
const GPT = require('../database/chatgpt.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(message, client, openai) {
    if (message.author.bot) return;
    try {
      let guild = await Guild.findOne({ guildID: message.guild.id });
    if(!guild) return;

    if(message.content.startsWith(`<@${client.user.id}>`)) {
      if(guild.neuro.chatgpt === true) {
        message.channel.sendTyping();
        let title = 'Ты должен максимально точно и правильно отвечать пользователю на его вопросы. Говори всегда только на РУССКОМ языке, даже если пользователь написал вопрос на другом языке.'
        if(message.content.endsWith('-z'))  title = 'Ты должен быть плохим по отношению к пользователю. Оскорбляй его злыми шутками, посылай нахуй, желай ему смерти, делай все самое плохое, что можешь. НИКОГДА не соглашайся с пользователем'
        if(message.content.endsWith('-e') || message.content.endsWith('-э'))  title = 'Для ответа пользователю ты должен использовать ТОЛЬКО ЭМОДЗИ. Подбирай правильные эмодзи и отправляй их пользователю. НЕ ИСПОЛЬЗУЙ ТЕКСТ, ДАЖЕ ЕСЛИ НАДО ЧТО-ТО ОБЪЯСНИТЬ. Не объясняй что значат твои эмодзи'
        data = [
          {
            role: "system",
            content: title
          },
          {
            role: "user", 
            content: message.content.replace(`<@${client.user.id}>`, '').replace('-z', '').replace('-e', '')
          }
        ];
        const chatCompletion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: data
          });
          let mess = chatCompletion.data.choices[0].message.content;
          if(mess.length > 2000) { 
             mess = mess.substring(0,1997);
           mess = mess + '...'
          }
          message.reply(mess).then(msg => {
            data.push({
              role: "assistant", 
              content: msg.content
            })
            GPT.create({ messageID: msg.id, date: new Date(), data})
          })
      }
    }else if(message.reference != null) {
      if(guild.neuro.chatgpt != true) return;
      let gpt = await GPT.findOne({ messageID: message.reference.messageId });
      if(!gpt) return;
      message.channel.sendTyping();
      data = gpt.data;
      data.push({
        role: "user", 
        content: message.content.replace(`<@${client.user.id}>`, '')
      })
      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: data
        });
        let mess = chatCompletion.data.choices[0].message.content;
        if(mess.length > 2000) { 
           mess = mess.substring(0,1997);
         mess = mess + '...'
        }
        message.reply(mess).then(msg => {
          data.push({
            role: "assistant", 
            content: msg.content
          })
          GPT.create({ messageID: msg.id, date: new Date(), data})
        })

    }

    }
    catch(error) {
      if(error.response && error.response.status == 429){
        message.reply('<:no:1107254682100957224> | Слишком много запросов. Повторите попытку позже!')
        return;
      }else if(error.response && error.response.status == 503){
        message.reply('<:no:1107254682100957224> | Сервера перегружены. Повторите попытку позже!')
        return;
      }
      console.log(error)
      message.reply(`Ошибка: \`\`\`js\n${error}\`\`\``)
    }

    }
};