/* Settings -> /rolereact
Настройка системы ролей за реакции
Задержка: 15 секунд

> delete - Удалить роли за реакции с сообщения
> set - Установить роли за реакции
*/

const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");
const { emojis } = require("../../../config.js");

module.exports = {
  category: 'settings',
  cooldown: 15,
  data: new SlashCommandBuilder()
    .setName("rolereact")
    .setDescription("Настройки ролей за реакции")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Удалить роли за реакции с сообщения")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID сообщения, с которого надо удалить РзР")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Установить роли за реакции")
        .addRoleOption((option) =>
          option
            .setName("роль")
            .setDescription("Роль, которую требуется выдавать")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("реакция")
            .setDescription("Реакция за которую выдается роль")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID сообщения, на которого надо установить реакцию")
            .setRequired(true)
        )
        .addChannelOption((option) =>
          option
            .setName("канал")
            .addChannelTypes(ChannelType.GuildText)
            .setDescription("Канал, в котором расположено сообщение")
            .setRequired(true)
        )
    ),
  async execute(interaction, guild) {
    await interaction.deferReply();
    // Подкоманда: Удаление РзР
    if (interaction.options.getSubcommand() === "delete") {
      id = interaction.options.getString("id");

      if (guild.rr.size < 1)
        return interaction.followUp(
          "Но у вас же не установлены роли за реакции..."
        );
      rr = guild.rr.get(id);
      if (!rr)
        return interaction.followUp(
          "На этом сообщении не установлены роли за реакции!"
        );

      guild.rr.delete(id);
      guild.save();
      interaction.followUp(
        "Роли за реакции успешно удалены с этого сообщения!"
      );
      // Подкоманда: Установка РзР
    } else if (interaction.options.getSubcommand() === "set") {
      role = interaction.options.getRole("роль");
      react = interaction.options.getString("реакция");
      id = interaction.options.getString("id");
      channel = interaction.options.getChannel("канал");

      // Проверяем роль и права
      const bot = interaction.guild.members.me;
      if (role == undefined) return interaction.followUp("Роли не существует?");
      if (role.rawPosition >= bot.roles.highest.rawPosition)
        return interaction.followUp(
          "Я не смогу выдать эту роль, поскольку она выше моей роли"
        );
      if (bot.permissions.has("ManageRoles") == false)
        return interaction.followUp(
          "У меня нет прав на управление ролями для выдачи ролей"
        );
      if (role.tags?.botId) return interaction.followUp("Это роль бота");
      if (role.tags?.premiumSubscriberRole)
        return interaction.followUp("Это роль бустера, ее нельзя выдать");
      if (role.tags?.integrationId || role.managed)
        return interaction.followUp("Данная роль управляется интеграцией");

      if (/\p{Emoji}/u.test(react) == false)
        return interaction.followUp(
          `${emojis.error} | Я думаю \`${react}\` не является эмодзи...`
        );
      if (react.includes("<")) {
        let reaction = react.split(":");
        reaction[2] = reaction[2].slice(0, -1);
        let emoji = await interaction.guild.emojis.cache.find(
          (emoji) => emoji.name === react[1]
        );
        if (!emoji || emoji.id != reaction[2])
          return interaction.followUp(
            `${emojis.error}| Кажется вы используете эмодзи, которых нет на этом сервере...`
          );
      }
      if (!channel.permissionsFor(interaction.guild.members.me).has(['AddReactions', 'ViewChannel'])) return interaction.followUp(`${emojis.error} | Мне нужны права "Установка реакций" в выбранном канале`)
      channel.messages
        .fetch(id)
        .then((message) => {
          message.react(react);
        })
        .catch(() => {
          return interaction.followUp(
            `${emojis.error}| Данного сообщения не существует в данном канале`
          );
        });

      let arr = await guild.rr.get(id);
      if (arr?.length > 0) {
        arr.push({
          role: role.id,
          emoji: react,
        });
        guild.rr.delete(id);
        guild.rr.set(id, arr);
        guild.save();
        return interaction.followUp(`${emojis.success} Успешно!`);
      } else {
        arr = [];
        arr.push({
          role: role.id,
          emoji: react,
        });
        guild.rr.set(id, arr);
        guild.save();
        return interaction.followUp(`${emojis.success} Успешно!`);
      }
    }
  },
};
