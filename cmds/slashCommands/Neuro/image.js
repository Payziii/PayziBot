const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { inspect } = require('util')

module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Генерация изображения')
        .addStringOption((option) =>
            option.setName('запрос')
            .setDescription('Опишите картинку, которую хотите получить')
            .setMaxLength(256)
            .setRequired(true) 
        ),
    async execute(interaction) {
        await interaction.deferReply();
        return interaction.editReply('<:timeout_clock:1134453176091824250> | Команда будет доступна в 1.1.0')
    },
};
