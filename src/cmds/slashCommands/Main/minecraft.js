const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder
} = require("discord.js");
const { emojis } = require("../../../config.js");
const minecraft = require("../../../func/apis/minecraft.js");

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
        ))
    .addSubcommand(subcommand =>
      subcommand
        .setName('player')
        .setDescription('Информация о лицензии Minecraft-игрока')
        .addStringOption((option) =>
          option
            .setName("ник")
            .setDescription("Никнейм игрока")
            .setRequired(true)
        )),
  async execute(interaction, guild) {
    await interaction.deferReply();
    if (interaction.options.getSubcommand() === 'server') {
      const ip = interaction.options.getString("адрес");
      await minecraft.getServer(ip).then((r) => {
        if (r === 'error') return interaction.editReply(`${emojis.error} | Произошла ошибка. Возможно, сервер не найден`);
        if (r?.ip == "127.0.0.1" || !r?.online) return interaction.editReply(`${emojis.error} | Сервер выключен!`);
        const playerList = r?.players?.list ? r.players.list.slice(0, 15).map(player => player.name).join(", ") : "Нет игроков";

        const embed = new EmbedBuilder()
          .setTitle(r?.hostname || r?.ip || "Неизвестный сервер")
          .setDescription(r?.motd?.clean ? r?.motd?.clean?.join('\n') : "Сервер не отправил MOTD")
          .addFields(
            { name: "IP", value: r?.ip, inline: true },
            { name: "Версия", value: r?.version, inline: true },
            { name: "Игроки", value: `**${r?.players?.online}**/**${r?.players?.max}**\n${playerList || "Не удалось получить список игроков"}`, inline: false },
          )
          .setColor(guild.colors.basic)
        if (r?.software) embed.setFooter({ text: r.software })
        interaction.editReply({ embeds: [embed] });
      });
    }else if (interaction.options.getSubcommand() === 'player') {
      const name = interaction.options.getString("ник");
      await minecraft.getPlayer(name).then((r) => {
        if (r === 'error') return interaction.editReply(`${emojis.error} | Произошла ошибка. Возможно, игрок не найден`);
        if (r?.code === "minecraft.invalid_username") return interaction.editReply(`${emojis.error} | Игрок не найден`);
        if(r?.code != "player.found") return interaction.editReply(`${emojis.error} | Произошла ошибка. Код: ${r?.code}`);
        const embed = new EmbedBuilder()
          .setTitle(r?.data?.player?.username || "Неизвестный игрок")
          .setDescription(`UUID: \`${r?.data?.player?.id}\``)
          .addFields(
            { name: "Скин", value: `[Скачать](${r?.data?.player?.skin_texture})`, inline: true },
          )
          .setThumbnail(r?.data?.player?.avatar)
          .setColor(guild.colors.basic)
        interaction.editReply({ embeds: [embed] });
      });
    }
  },
};
