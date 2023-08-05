const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Размутить пользователя')
        .addUserOption((option) =>
            option
                .setName('пользователь')
                .setDescription('Пользователь, которого нужно размутить')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('причина')
                .setDescription('Причина размута')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction, guild) {
        let user = interaction.options.getUser('пользователь');
        author = await interaction.guild.members.cache.get(interaction.user.id);
        bot = await interaction.guild.members.me;
        
        if(bot.permissions.has("ModerateMembers") == false) return interaction.reply("<:no:1107254682100957224> | У меня нет прав для размута пользователей");
        let msg;
        let reason = interaction.options.getString('причина') || "Причина отсутствует";
        let error = false;
        switch (user.id) {
            case interaction.guild.ownerId:
                error = true;
                msg = '<:no:1107254682100957224> | Мне кажется это владелец сервера. Или мне кажется?';
                break;
            case interaction.user.id:
                error = true;
                msg = '<:no:1107254682100957224> | Я думал ты не в муте, ну ок)';
                break;
            case bot.id:
                error = true;
                msg = '<:no:1107254682100957224> | А как я это пишу?';
                break;
            default:
                msg = `${user} был размучен. Причина: ${reason}`;
        }
        reason = interaction.user.username + ': ' + reason;
        member = await interaction.guild.members.cache.get(user.id);
        if(error != true) { member.timeout(null, reason) }
        interaction.reply(msg)
    },
};
