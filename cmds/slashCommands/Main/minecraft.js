const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder
} = require("discord.js");
const { emojis } = require("../../../config.js");
const minecraft = require("../../../func/minecraft.js");

module.exports = {
  category: "utility",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("minecraft")
    .setDescription("Информация о игроке или сервере")
    .addSubcommand(subcommand =>
      subcommand
        .setName('server')
        .setDescription('Информация о Minecraft-сервере')
        .addStringOption((option) =>
          option
            .setName("адрес")
            .setDescription("Адрес сервера")
            .setRequired(true)
        )),
  async execute(interaction, guild) {
    await interaction.deferReply();
    if (interaction.options.getSubcommand() === 'server') {
      const ip = interaction.options.getString("адрес");
      await minecraft.getServer(ip).then((r) => {
        if (r === 'error') return interaction.editReply(`${emojis.error} | Произошла ошибка. Возможно, сервер не найден`);
        if (r?.ip == "127.0.0.1" || !r?.online) return interaction.editReply(`${emojis.error} | Сервер выключен!`);
        const playerList = r?.players?.list ? r.players.list.slice(0, 15).map(player => player.name).join(", ") : "Не удалось получить список игроков";

        const embed = new EmbedBuilder()
          .setTitle(r?.hostname)
          .addFields(
            { name: "IP", value: r?.ip, inline: false },
            { name: "Игроки", value: `**${r?.players?.online}**/**${r?.players?.max}**\n${playerList || "Не удалось получить список игроков"}`, inline: false },
            { name: "Версия", value: r?.version, inline: false }
          )
          .setColor(guild.colors.basic)
          if(r?.software) embed.setFooter({ text: r.software })
          interaction.editReply({ embeds: [embed] });
      });
    }
  },
};
