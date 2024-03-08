const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { emojis } = require('../../../config.js');

module.exports = {
  skip: true,
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Настройки приветственного сообщения')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('off')
        .setDescription('Выключить приветственное сообщение и автороль'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Установить приветственное сообщение')
        .addChannelOption((option) =>
          option
            .setName('канал')
            .addChannelTypes(ChannelType.GuildText)
            .setDescription('Канал для приветственного сообщения')
            .setRequired(true)
        ))
    .addSubcommand(subcommand =>
      subcommand
        .setName('autorole')
        .setDescription('Установить роль для выдачи новому пользователю')
        .addRoleOption((option) =>
          option
            .setName('роль')
            .setDescription('Роль, которую необходимо выдавать новым пользователям')
            .setRequired(true)
        )),
  async execute(interaction, guild) {
    if (interaction.options.getSubcommand() === 'off') {
      if (guild.welcome.channelID == '-1' && guild.welcome.autoRoleID == '-1') return interaction.followUp(`${emojis.error} | Приветственное сообщение уже выключено`)
      guild.welcome.channelID = '-1';
      guild.welcome.autoRoleID = '-1';
      guild.save()
      await interaction.reply(`${emojis.success} Приветственное сообщение было отключено!`)
    } else if (interaction.options.getSubcommand() === 'setup') {
      channel = interaction.options.getChannel('канал')
      guild.welcome.channelID = channel.id;
      guild.save()

      const modal = new ModalBuilder()
			.setCustomId('welcome')
			.setTitle('Настройка сообщений о входе');

      const text = new TextInputBuilder()
			.setCustomId('text')
			.setLabel("Введите текст, который будет выводиться")
      .setMaxLength(1024)
			.setStyle(TextInputStyle.Paragraph);

      const textRow = new ActionRowBuilder().addComponents(text);

      modal.addComponents(textRow);

      await interaction.showModal(modal);
    } else if (interaction.options.getSubcommand() === 'stars-needed') {
      count = interaction.options.getInteger('количество')
      guild.starboard.reqReacts = count;
      guild.save()
      interaction.followUp(`${emojis.success} Выбрано количество звёзд для попадания на звездную доску: \`${count}\``)
    }
  },
};