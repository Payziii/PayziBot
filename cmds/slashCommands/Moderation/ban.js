const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Блокировка пользователя')
        .addUserOption((option) =>
            option
                .setName('пользователь')
                .setDescription('Пользователь, которого нужно заблокировать')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('причина')
                .setDescription('Причина блокировки')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, guild) {
        let user = interaction.options.getUser('пользователь');
        author = await interaction.guild.members.cache.get(interaction.user.id);
        bot = await interaction.guild.members.me;
        
        if(bot.permissions.has("BanMembers") == false) return interaction.reply("<:no:1107254682100957224> | У меня нет прав для блокировки пользователей");
        let msg;
        let reason = interaction.options.getString('причина') || "Причина отсутствует";
        let error = false;
        switch (user.id) {
            case interaction.guild.ownerId:
                error = true;
                msg = '<:no:1107254682100957224> | Вы не можете заблокировать владельца сервера';
                break;
            case interaction.user.id:
                error = true;
                msg = '<:no:1107254682100957224> | Вы не можете заблокировать лучшего человека на этом сервере';
                break;
            case bot.id:
                error = true;
                msg = '<:no:1107254682100957224> | Как я заблокирую самого себя?';
                break;
            default:
                msg = `${user} был заблокирован. Причина: ${reason}`;
        }
        reason = interaction.user.username + ': ' + reason;
        member = await interaction.guild.members.cache.get(user.id);
        if(error != true) {
            member.ban({reason: reason}) 
            .then(() => interaction.reply(msg))
            .catch(() => interaction.reply('<:no:1107254682100957224> | Кажется я не могу заблокировать этого пользователя...'))
        }else{
            interaction.reply(msg)
        }
    },
};
