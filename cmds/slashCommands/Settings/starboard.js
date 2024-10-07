const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { emojis } = require('../../../config.js');

module.exports = {
  category: 'settings',
    cooldown: 15,
    data: new SlashCommandBuilder()
        .setName('starboard')
        .setDescription('Настройки звёздной доски')
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
        if(guild.starboard.channelID == '-1') return interaction.followUp(`${emojis.error} | Звёздная доска и так выключена...`)
        guild.starboard.channelID = '-1';
        guild.save()
        interaction.followUp(`${emojis.success} Звёздная доска успешно выключена!`)
      }else if (interaction.options.getSubcommand() === 'channel-set') {
        channel = interaction.options.getChannel('канал')
        if (!channel.permissionsFor(interaction.guild.members.me).has(['SendMessages', 'ViewChannel'])) return interaction.followUp(`${emojis.error} | Я не могу отправлять сообщения в выбранном канале...`)
        guild.starboard.channelID = channel.id;
        guild.save()
        interaction.followUp(`${emojis.success} Звёздная доска успешно включена в канале <#${channel.id}>`)
      }else if (interaction.options.getSubcommand() === 'stars-needed') {
        count = interaction.options.getInteger('количество')
        guild.starboard.reqReacts = count;
        guild.save()
        interaction.followUp(`${emojis.success} Выбрано количество звёзд для попадания на звездную доску: \`${count}\``)
      }
    },
};