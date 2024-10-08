const {
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { channels } = require("../config.js");

module.exports = {
  name: Events.GuildCreate,
  async execute(guild, client) {
    const embed = new EmbedBuilder()
      .setTitle("Новый сервер")
      .setDescription(
        `Название: **${guild.name}**\nУчастников: **${
          guild.memberCount
        }**\nВладелец: **${
          guild.members.cache.get(guild.ownerId).user.username
        }** (${guild.ownerId})\n\nСервер создан: <t:${(
          guild.createdTimestamp / 1000
        ).toFixed(0)}:D> (<t:${(guild.createdTimestamp / 1000).toFixed(0)}:R>)`
      )
      .setColor("#3fcc65")
      .setFooter({
        text: `ID: ${guild.id}`,
      });
    client.channels.cache.get(channels.serverLogs).send({ embeds: [embed] });

    if (guild.members.me.permissions.has("SendMessages")) {
      const channel = await guild.channels.cache.find(
        (channel) =>
          channel.isTextBased() &&
          channel
            .permissionsFor(guild.members.me)
            .has(["SendMessages", "ViewChannel", "EmbedLinks"])
      );
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle("Спасибо, что добавили меня на сервер!")
        .setDescription(
          "Чтобы посмотреть список команд, введите: `/help`\n\nЕсли у вас возникли вопросы или появились проблемы, обратитесь на [сервер поддержки](https://discord.gg/E7SFuVEB2Z)\n\nПодробное описание команд и функций вы можете найти в [документации](https://docs.payzibot.ru/)"
        )
        .setColor("#3fcc65")
        .setFooter({
          text: "Сообщение отправлено, поскольку бот был добавлен на сервер",
        });

      const support = new ButtonBuilder()
        .setLabel("Сервер поддержки")
        .setURL("https://discord.gg/E7SFuVEB2Z")
        .setStyle(ButtonStyle.Link);

      const row = new ActionRowBuilder().addComponents(support);

      await channel.send({ embeds: [embed], components: [row] });
    }
  },
};
