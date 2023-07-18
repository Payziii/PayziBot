const Discord = require('discord.js');
const fs = require('fs');
const { inspect } = require('util')
const config = require('../../config.js');
exports.run = async (client, message, args, player, guild) => {
     let user = message.author.id;
        if (!config.owners.includes(user)) return;
        let res;

        try {
            res = await eval(args.join(' '));
        } catch (error) {
            res = error;
        }
        await message.reply(
            `\`\`\`js\n${inspect(res, { depth: 0 }).slice(0, 1900)}\n\`\`\``
        );
       }
       exports.help = {
    name: ",eval",
    aliases: [',e', ',е', ',евал'],
    info: "owner",
    usage: "[Команда]",
    perm: "Developer",
    description: "Выполнить код"
    }