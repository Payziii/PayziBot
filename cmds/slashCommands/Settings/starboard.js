const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits, ChannelType} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starboard')
        .setDescription('Насройки звёздной доски')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
          subcommand
              .setName('off')
              .setDescription('Выключить звёздную доску'))
      .addSubcommand(subcommand =>
          subcommand
              .setName('channel-set')
              .setDescription('Установить канал')
              .addChannelOption((option) =>
            option
                .setName('канал')
                .addChannelTypes(ChannelType.GuildText)
                .setDescription('Канал, в который будут отправляться сообщения')
                .setRequired(true)
        ))
        .addSubcommand(subcommand =>
          subcommand
              .setName('stars-needed')
              .setDescription('Установить количество звёзд, необходимых для попадания на доску')
              .addIntegerOption((option) =>
            option
                .setName('количество')
                .setDescription('Сколько звёзд надо для попадания на доску (1-30)')
                .setMinValue(1)
                .setMaxValue(30)
                .setRequired(true)
        )),
    async execute(interaction, guild) {
      await interaction.deferReply();
      if (interaction.options.getSubcommand() === 'off') {
        guild.settings.starboard.channelID = '-1';
        guild.save()
        interaction.followUp('Звёздная доска успешно выключена!')
      }else if (interaction.options.getSubcommand() === 'channel-set') {
        channel = interaction.options.getChannel('канал')
        guild.settings.starboard.channelID = channel.id;
        guild.save()
        interaction.followUp(`Звёздная доска успешно включена в канале <#${channel.id}>`)
      }else if (interaction.options.getSubcommand() === 'stars-needed') {
        count = interaction.options.getInteger('количество')
        guild.settings.starboard.reqReacts = count;
        guild.save()
        interaction.followUp(`Выбрано количество звёзд для попадания на звездную доску: \`${count}\``)
      }
    },
};