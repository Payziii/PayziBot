const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Кикнуть пользователя с сервера')
        .addUserOption((option) =>
            option
                .setName('пользователь')
                .setDescription('Пользователь, которого нужно кикнуть')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('причина')
                .setDescription('Причина блокировки')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        let user = interaction.options.getUser('пользователь');
        author = await interaction.guild.members.cache.get(interaction.user.id);
        bot = await interaction.guild.members.me;
        
        if(bot.permissions.has("KickMembers") == false) return interaction.reply("<:no:1107254682100957224> | У меня нет прав для того, чтобы выгонять пользователей...");
        let msg;
        let reason = interaction.options.getString('причина') || "Причина отсутствует";
        let error = false;
        switch (user.id) {
            case interaction.guild.ownerId:
                error = true;
                msg = '<:no:1107254682100957224> | Он не может выйти с сервера даже самостоятельно. Как я его выгоню?';
                break;
            case interaction.user.id:
                error = true;
                msg = '<:no:1107254682100957224> | Не пробовал просто выйти с сервера?';
                break;
            case bot.id:
                error = true;
                msg = '<:no:1107254682100957224> | А может я не хочу выходить с этого прекрасного сервера!';
                break;
            default:
                msg = `${user} был выгнан с этого замечательного сервера. Причина: ${reason}`;
        }
        reason = interaction.user.username + ': ' + reason;
        member = await interaction.guild.members.cache.get(user.id);
        if(error != true) {
            member.kick({reason: reason}) 
            .then(() => interaction.reply(msg))
            .catch(() => interaction.reply('<:no:1107254682100957224> | Кажется я не могу выгнать этого пользователя...'))
        }else{
            interaction.reply(msg)
        }
    },
};
