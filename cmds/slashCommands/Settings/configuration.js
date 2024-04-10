const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
} = require("discord.js");
const { emojis } = require("../../../config.js");

module.exports = {
  cooldown: 15,
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
            .setLabel("Успех")
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
        content: "Выберите цвет, который хотите изменить",
        components: [row],
      });

      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 600_000,
      });

      collector.on("collect", async (i) => {
        const selection = i.values[0];

        const collectorFilter2 = (response) => {
          return interaction.user.id === response.author.id;
        };

        await interaction
          .editReply({
            content: "Введите цвет в формате #HEX",
            components: [],
          })
          .then(() => {
            interaction.channel
              .awaitMessages({
                filter: collectorFilter2,
                max: 1,
                time: 45000,
                errors: ["time"],
              })
              .then((collected) => {
                if (/^#[0-9A-F]{6}$/i.test(collected.first().content)) {
                  switch (selection) {
                    case "basic":
                      guild.colors.basic = collected.first().content;
                      break;
                    case "error":
                      guild.colors.error = collected.first().content;
                      break;
                    case "correct":
                      guild.colors.correct = collected.first().content;
                      break;
                    case "starboard":
                      guild.colors.starboard = collected.first().content;
                      break;
                    case "giveaway":
                      guild.colors.giveaway = collected.first().content;
                      break;
                  }
                  guild.save();
                  interaction.editReply(
                    `Для эмбеда типа \`${selection}\` установлен цвет \`${
                      collected.first().content
                    }\``
                  );
                  return;
                }
                interaction.editReply(
                  `${emojis.error} | Цвет \`${
                    collected.first().content
                  }\` не найден!`
                );
              })
              .catch(() => {
                interaction.editReply("Время ожидания истекло...");
              });
          });
      });
    }
  },
};
