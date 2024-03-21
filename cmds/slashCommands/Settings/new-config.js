const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { emojis } = require('../../../config.js');

module.exports = {
  cooldown: 15,
  skip: true,
  data: new SlashCommandBuilder()
    .setName('configuration')
    .setDescription('Конфигурация сервера')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(subcommand =>
      subcommand
        .setName('color')
        .setDescription('Установка и изменение цвета эмбеда')
    ),
  async execute(interaction, guild) {
    if (interaction.options.getSubcommand() === 'color') {
      interaction.reply("В процессе разработки")
    }
  }
};