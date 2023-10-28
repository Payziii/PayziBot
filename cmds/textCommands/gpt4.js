const { inspect } = require('util')
const RsnChat = require('rsnchat');
const rsnchat = new RsnChat('CHATGPT_gBYbmLjx3O');
const config = require('../../config.js');

exports.run = async (client, message, args, guild) => {
    rsnchat.gpt(args.join(' '))
  .then(response => {
    message.reply(response.message);
  })
       }
       exports.help = {
    name: ",gpt4",
    aliases: [',chatgpt4'],
    info: "owner",
    usage: "[Команда]",
    perm: "Developer",
    description: "Выполнить код"
    }