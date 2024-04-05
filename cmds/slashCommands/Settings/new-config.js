const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType
} = require("discord.js");
const { emojis } = require("../../../config.js");

module.exports = {
  cooldown: 15,
  skip: true,
  data: new SlashCommandBuilder()
    .setName("configuration")
    .setDescription("Конфигурация сервера")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("color")
        .setDescription("Установка и изменение цвета эмбеда")
    ),
  async execute(interaction, guild) {
    if (interaction.options.getSubcommand() === "color") {
      const select = new StringSelectMenuBuilder()
        .setCustomId("option")
        .setPlaceholder("Категории цвета")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Основной")
            .setDescription("Основной цвет")
            .setValue("basic"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Ошибка")
            .setDescription("Цвет ошибки")
            .setValue("error"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Верный")
            .setDescription("Цвет успешного выполнения")
            .setValue("correct"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Звездная доска")
            .setDescription("Цвет звездной доски")
            .setValue("starboard"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Розыгрыш")
            .setDescription("Цвет розыгрыша")
            .setValue("giveaway")
        );

      const row = new ActionRowBuilder().addComponents(select);

      const response = await interaction.reply({
        content: 'Выберите цвет, который хотите изменить',
        components: [row],
      });
      
      const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 600_000 });
      
      collector.on('collect', async i => {
        interaction.editReply({
          content: 'Действуйте дальнейшим указаниям бота',
          components: [],
        });
        const selection = i.values[0];
        await i.reply(`${i.user} has selected ${selection}!`);
      });
      
    }
  },
};
