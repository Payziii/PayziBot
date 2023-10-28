const { inspect } = require('util')
const config = require('../../config.js');

exports.run = async (client, message, args, guild) => {
    if(message.member.permissions.has("Administrator") == false) return message.reply('Доступно только администраторам сервера!');
    if(!args[0]) return message.reply('Введите значение: вкл или выкл');
    if(args[0] == 'вкл') {
        if(guild.neuro.chatgpt == true) return message.reply('GPT-модуль уже включён');
        guild.neuro.chatgpt = true;
        guild.save();
        message.reply('GPT-модуль подключен к данному серверу!');
        return;
    }else if(args[0] == 'выкл') {
        if(guild.neuro.chatgpt == false) return message.reply('GPT-модуль уже выключён');
        guild.neuro.chatgpt = false;
        guild.save();
        message.reply('GPT-модуль успешно выключен на данном сервере!');
        return;
    }
       }
       exports.help = {
    name: ",gpt",
    aliases: [',chatgpt'],
    info: "owner",
    usage: "[Команда]",
    perm: "Developer",
    description: "Выполнить код"
    }