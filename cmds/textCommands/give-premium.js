const { inspect } = require('util')
const config = require('../../config.js');

exports.run = async (client, message, args) => {
     let author = message.author.id;
        if (!config.owners.includes(author)) return;
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
    name: ",gp",
    aliases: [',givepremium', ',give-premium'],
    info: "owner",
    usage: "[Команда]",
    perm: "Developer",
    description: "Выполнить код"
    }