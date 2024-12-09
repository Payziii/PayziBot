const {
  SlashCommandBuilder,
  EmbedBuilder
} = require("discord.js");
const { emojis } = require("../../../config.js");
const price = require("../../../func/price.js");

module.exports = {
  category: "utility",
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("exchange")
    .setDescription("Курс валют")
    .addStringOption((option) =>
      option
        .setName("из")
        .setDescription("Валюта, курс которой Вы хотите посмотреть (пр. USD)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("в")
        .setDescription("Валюта, курс в которой вы хотите посмотреть (пр. RUB)")
        .setRequired(true)
    ),
  async execute(interaction, guild) {
    const from = interaction.options.getString("из");
    const to = interaction.options.getString("в");
    await interaction.deferReply();
    
    await price.convert(process.env.PRICE, from.toUpperCase(), to, 1).then((r) => {
      interaction.editReply(`${emojis.exchange} **1** ${r.from} = **${r.value.toFixed(2)}** ${r.to}`);
    }).catch(() => {
      interaction.editReply(`${emojis.error} | Произошла ошибка. Возможно, валюта не найдена`);
    })
  },
};
