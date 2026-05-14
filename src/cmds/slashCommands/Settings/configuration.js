/* Settings -> /configuration
Конфигурация сервера
Задержка: 7 секунд

> color - Установка и изменение цвета эмбеда
*/

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
  category: 'settings',
  cooldown: 7,
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
            .setValue("giveaway"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Достижение")
            .setDescription("Цвет получения достижения")
            .setValue("achievement")
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
                let clr = collected.first().content;
                if(!clr.startsWith("#")) clr = `#${clr}`;
                if (/^#[0-9A-F]{6}$/i.test(clr)) {
                  switch (selection) {
                    case "basic":
                      guild.colors.basic = clr;
                      break;
                    case "error":
                      guild.colors.error = clr;
                      break;
                    case "correct":
                      guild.colors.correct = clr;
                      break;
                    case "starboard":
                      guild.colors.starboard = clr;
                      break;
                    case "giveaway":
                      guild.colors.giveaway = clr;
                      break;
                    case "achievement":
                      guild.colors.achievement = clr;
                      break;
                  }
                  guild.save();
                  interaction.editReply(
                    `Для эмбеда типа \`${selection}\` установлен цвет \`${
                      clr
                    }\``
                  );
                  return;
                }
                interaction.editReply(
                  `${emojis.error} | Цвет \`${
                    clr
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
