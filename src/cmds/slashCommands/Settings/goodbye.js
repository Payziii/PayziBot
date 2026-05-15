/* Settings -> /goodbye
Настройка системы прощальных сообщений
Задержка: 7 секунд

> off - Выключить прощальное сообщение
> setup - Установить прощальное сообщение
*/

const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { emojis } = require('../../../config.js');

module.exports = {
  category: 'settings',
  cooldown: 7,
  data: new SlashCommandBuilder()
    .setName('goodbye')
    .setDescription('Настройки прощального сообщения')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('overview')
        .setDescription('Просмотр настроек приветственного сообщения'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('off')
        .setDescription('Выключить прощальное сообщение'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Установить прощальное сообщение')
        .addChannelOption((option) =>
          option
            .setName('канал')
            .addChannelTypes(ChannelType.GuildText)
            .setDescription('Канал для прощального сообщения')
            .setRequired(true)
        )),
  async execute(interaction, guild) {
    if(interaction.options.getSubcommand() === 'overview') {
      if (guild.leave.channelID == '-1') return interaction.reply(`${emojis.error} | Прощальное сообщение выключено`)
      interaction.reply({
        content: `${emojis.success} | Прощальное сообщение **включено**!\n\nКанал: <#${guild.leave.channelID}>\nТекст прощального сообщения: \`\`\`${guild.leave.leaveText}\`\`\``
      })
    }
    else if (interaction.options.getSubcommand() === 'off') {
      if (guild.leave.channelID == '-1') return interaction.reply(`${emojis.error} | Прощальное сообщение уже выключено`)
      guild.leave.channelID = '-1';
      guild.save()
      await interaction.reply(`${emojis.success} Прощальное сообщение было отключено!`)
    } else if (interaction.options.getSubcommand() === 'setup') {
      channel = interaction.options.getChannel('канал')

      if (!channel.permissionsFor(interaction.guild.members.me).has(['SendMessages', 'ViewChannel'])) return interaction.reply(`${emojis.error} | Для отправки прощальных сообщений мне необходимо иметь права \`Отправлять сообщения\` и \`Просматривать канал\` в выбранном канале!`)

      guild.leave.channelID = channel.id;
      guild.save()

      const modal = new ModalBuilder()
			.setCustomId('leave')
			.setTitle('Настройка сообщений о выходе');

      const text = new TextInputBuilder()
			.setCustomId('text')
			.setLabel("Введите текст, который будет выводиться")
      .setMaxLength(1024)
			.setStyle(TextInputStyle.Paragraph);

      const textRow = new ActionRowBuilder().addComponents(text);

      modal.addComponents(textRow);

      await interaction.showModal(modal);
    }
  },
};