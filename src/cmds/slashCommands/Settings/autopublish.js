/* Settings -> /autopublish
Настройка системы автоматической публикации сообщений из каналов с объявлениями.
Задержка: 7 секунд

> remove - Выключить автоматическую публикацию для канала
> list - Показать список каналов с автоматической публикацией
> set - Установить автоматическую публикацию для канала
*/

const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const { emojis } = require('../../../config.js');

module.exports = {
  category: 'settings',
  cooldown: 7,
  data: new SlashCommandBuilder()
    .setName('autopublish')
    .setDescription('Настройки автоматической публикации сообщений из каналов с объявлениями')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('Список каналов с автоматической публикацией'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Установить автоматическую публикацию')
        .addChannelOption((option) =>
          option
            .setName('канал')
            .addChannelTypes(ChannelType.GuildAnnouncement)
            .setDescription('Канал, в котором будет работать автоматическая публикация')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Удалить канал из списка автоматической публикации')
        .addChannelOption((option) =>
          option
            .setName('канал')
            .addChannelTypes(ChannelType.GuildAnnouncement)
            .setDescription('Канал, в котором требуется удалить автоматическую публикацию')
            .setRequired(true)
        )
    ),
  async execute(interaction, guild) {
    await interaction.deferReply();
    if (interaction.options.getSubcommand() === 'list') {
      if(guild.autoPublishingChannels.length === 0) return interaction.followUp(`${emojis.error} | Каналов с автоматической публикацией нет!`)
      const channels = guild.autoPublishingChannels.map(id => `<#${id}>`).join('\n');
      interaction.followUp(`${emojis.success} | Каналы с автоматической публикацией:\n${channels}`);
    }else if (interaction.options.getSubcommand() === 'set') {
      const channel = interaction.options.getChannel('канал');
      if (guild.autoPublishingChannels.includes(channel.id)) return interaction.followUp(`${emojis.error} | Этот канал уже есть в списке автоматической публикации!`)
      guild.autoPublishingChannels.push(channel.id);
      guild.save();
      interaction.followUp(`${emojis.success} Канал ${channel} успешно добавлен в список автоматической публикации!`)
    }else if (interaction.options.getSubcommand() === 'remove') {
      const channel = interaction.options.getChannel('канал');
      if (!guild.autoPublishingChannels.includes(channel.id)) return interaction.followUp(`${emojis.error} | Этот канал не находится в списке автоматической публикации!`)
      guild.autoPublishingChannels = guild.autoPublishingChannels.filter(id => id !== channel.id);
      guild.save();
      interaction.followUp(`${emojis.success} Канал ${channel} успешно удален из списка автоматической публикации!`)
    }
  },
};