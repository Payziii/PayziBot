const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Очистить сообщения в канале')
        .addIntegerOption((option) =>
            option
                .setName('количество')
                .setDescription('Количество сообщений, которые требуется очистить')
                .setMinValue(1)
                .setMaxValue(1000)
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        await interaction.deferReply();
        bot = await interaction.guild.members.me;
        if(bot.permissions.has("ManageMessages") == false) return interaction.editReply("<:no:1107254682100957224> | У меня нет прав для того, чтобы очищать сообщения...");

        count = interaction.options.getInteger('количество')
        interaction.channel.bulkDelete(count)
        .then(messages => {
            interaction.editReply(`<:yes:1107254746336735312> | Очищено ${messages.size} за последние 2 недели`)
    })
        .catch(console.error);
        interaction.editReply("<:no:1107254682100957224> | Непредвиденная ошибка?");
    },
};
