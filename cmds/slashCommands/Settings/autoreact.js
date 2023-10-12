const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    cooldown: 15,
    data: new SlashCommandBuilder()
        .setName('autoreact')
        .setDescription('Настройки автореакта')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
          subcommand
              .setName('off')
              .setDescription('Выключить автореакт'))
      .addSubcommand(subcommand =>
          subcommand
              .setName('set')
              .setDescription('Установить автореакт')
              .addChannelOption((option) =>
            option
                .setName('канал')
                .addChannelTypes(ChannelType.GuildText)
                .setDescription('Канал, в котором будет работать автореакт')
                .setRequired(true)
              
        )
        .addStringOption((option) =>
            option
                .setName('реакции')
                .setDescription('Реакции (через пробел), которые будут ставиться на сообщения')
                .setRequired(true)
          )),
    async execute(interaction, guild) {
      await interaction.deferReply();
      if (interaction.options.getSubcommand() === 'off') {
        if(guild.autoreact.channelID == '-1' && guild.autoreact.reacts.length == 0) return interaction.followUp(`<:no:1107254682100957224> | Я думаю, автореакт и так выключен...`)
        guild.autoreact.channelID = '-1';
        guild.autoreact.reacts = [];
        guild.save()
        interaction.followUp('Автореакт успешно выключен!')
      }else if (interaction.options.getSubcommand() === 'set') {
        channel = interaction.options.getChannel('канал')
        text = interaction.options.getString('реакции')
        reacts = text.split(' ');
        if(reacts.length > 7) return interaction.followUp(`<:no:1107254682100957224> | Серверам без **PayziBot Premium** разрешено добавлять до 7 реакций в автореакт. Повысьте этот лимит до 15 реакций, купив подписку`)
        for(reaction of reacts) {
          if(/\p{Emoji}/u.test(reaction) == false) return interaction.followUp(`<:no:1107254682100957224> | Я думаю \`${reaction}\` не является эмодзи...`)
           if(reaction.includes('<')) {
           reaction = reaction.split(':')
           reaction[2] = reaction[2].slice(0, -1)
           let emoji = await interaction.guild.emojis.cache.find(emoji => emoji.name === reaction[1]);
           if(!emoji || emoji.id != reaction[2]) return interaction.followUp(`<:no:1107254682100957224> | Кажется вы используете эмодзи, которых нет на этом сервере...`)
           }
        }
        guild.autoreact.channelID = channel.id;
        guild.autoreact.reacts = reacts;
        guild.save()
        interaction.followUp(`Автореакт успешно включён в канале <#${channel.id}> с реакциями: ${reacts.join(', ')}`)
      }
    },
};