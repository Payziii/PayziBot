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
      if (guild.welcome.channelID == '-1' && guild.welcome.autoRoleID == '-1') return interaction.reply(`${emojis.error} | Приветственное сообщение уже выключено`)
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
    } else if (interaction.options.getSubcommand() === 'autorole') {
      role = interaction.options.getRole('роль');
      bot = interaction.guild.members.me;

      if(role.rawPosition >= bot.roles.highest.rawPosition) return interaction.reply(`${emojis.error} | Увы, я не смогу выдать роль, которая выше моей`)
      if (bot.permissions.has('ManageRoles') == false) return interaction.reply(`${emojis.error} | У меня нет прав для выдачи ролей`);
      if(role.tags?.botId) return interaction.reply(`${emojis.error} | Роль принадлежит боту <@${role.tags.botId}>`);
      if(role.tags?.premiumSubscriberRole) return interaction.reply(`${emojis.error} | Я не смогу выдать роль бустера!`);
      if(role.tags?.integrationId || role.managed) return interaction.reply(`${emojis.error} | Роль управляется интеграцией`);

      guild.welcome.autoRoleID = role.id;
      guild.save();

      interaction.reply(`${emojis.success} Выбрана автороль по умолчанию: <@&${role.id}>`)
    }
  },
};