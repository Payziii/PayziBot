const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const { emojis } = require('../../../config.js');
const { setLevelGuildEnabled, getLevelGuild, setLevelGuildChannel, getLevelUserByGuild, putLevelUser, MathNextLevel } = require('../../../database/levels.js');

module.exports = {
  category: 'settings',
  //skip: true,
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName('levels')
    .setDescription('Настройки системы уровней')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('toggle')
        .setDescription('Включить/Выключить систему уровней'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('channel-set')
        .setDescription('Установить канал для оповещений о новом уровне')
        .addChannelOption((option) =>
          option
            .setName('канал')
            .addChannelTypes(ChannelType.GuildText)
            .setDescription('Канал, в который будут отправляться сообщения')
            .setRequired(false)
        ))
    .addSubcommand(subcommand =>
      subcommand
        .setName('message')
        .setDescription('Установить сообщение о новом уровне'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('set-level')
        .setDescription('Установить уровень определенному пользователю')
        .addUserOption((option) =>
          option
            .setName('пользователь')
            .setDescription('Пользователь, которому вы хотите установить уровень')
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName('уровень')
            .setDescription('Уровень, который вы хотите установить')
            .setMinValue(1)
            .setMaxValue(1000)
            .setRequired(true))),
  async execute(interaction, guild) {
    const g = await getLevelGuild(interaction.guild.id);

    if (interaction.options.getSubcommand() === 'toggle') {

      await setLevelGuildEnabled(interaction.guild.id, !g.enabled)
      interaction.reply(`${emojis.success} Система уровней теперь **${!g.enabled ? 'включена' : 'выключена'}**!`)

    } else if (interaction.options.getSubcommand() === 'channel-set') {

      channel = interaction.options.getChannel('канал')
      cid = channel?.id || "-1"
      await setLevelGuildChannel(interaction.guild.id, cid)
      if (!channel.permissionsFor(interaction.guild.members.me).has(['SendMessages', 'ViewChannel'])) return interaction.reply(`${emojis.error} | Я не могу отправлять сообщения в выбранном канале...`)
      interaction.reply(`${emojis.success} Оповещения о новом уровне будут приходить в ${cid != "-1" ? `канал <#${cid}>` : `канал, в котором пользователь написал сообщение`}`)

    } else if (interaction.options.getSubcommand() === 'message') {

      const modal = new ModalBuilder()
        .setCustomId('level')
        .setTitle('Настройка сообщений о новом уровне');

      const text = new TextInputBuilder()
        .setCustomId('text')
        .setLabel("Введите текст, который будет выводиться")
        .setMaxLength(1024)
        .setStyle(TextInputStyle.Paragraph);

      const textRow = new ActionRowBuilder().addComponents(text);

      modal.addComponents(textRow);

      await interaction.showModal(modal);

    } else if (interaction.options.getSubcommand() === 'set-level') {

      const level = interaction.options.getInteger('уровень');
      const _user = interaction.options.getUser('пользователь');

      const user = await getLevelUserByGuild(interaction.guild.id, _user.id);
      const xps = MathNextLevel(level-1, g.xp.koeff)

      user.xp = parseInt(xps)
      user.level = level

      putLevelUser(interaction.guild.id, user)

      interaction.reply(`${emojis.success} Пользователю <@${_user.id}> успешно установлен **${level}** уровень (${xps} XP)`)

    }
  },
};