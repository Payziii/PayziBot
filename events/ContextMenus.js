const { Events, Collection } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isContextMenuCommand()) return;
        if (interaction.channel === null) return interaction.reply("<:no:1107254682100957224> | Я доступен только на серверах!");
        const cmd = interaction.client.commands.get(interaction.commandName);
        if (!cmd) return interaction.reply(`<:no:1107254682100957224> | Команда не найдена. Как такое могло произойти?`)
        try {
            await cmd.execute(interaction);
        } catch (error) {
            if (interaction.deferred === false) {
                interaction.reply(`<:no:1107254682100957224> | Произошла ошибка!\n\`\`\`bash\n${error}\`\`\``);
            } else {
                interaction.editReply(`<:no:1107254682100957224> | Произошла ошибка!\n\`\`\`bash\n${error}\`\`\``);
            }
            console.log(error);
        }
    },
};