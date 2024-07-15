const { SlashCommandBuilder } = require("discord.js");
const { CheckAch } = require('../../../func/games/giveAch.js');
const { emojis } = require('../../../config.js');

const { RsnChat } = require('rsnchat');
const rsnchat = new RsnChat(process.env.RSN);

module.exports = {
    category: 'neuro',
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Генерация изображения')
        .addStringOption((option) =>
            option.setName('запрос')
                .setDescription('Опишите картинку, которую хотите получить')
                .setMaxLength(256)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('модель')
                .setDescription('Модель для генерации картинки')
                .setRequired(true)
                .addChoices(
                    { name: 'Sdxl', value: 'sdxl' },
                    { name: 'Kandinsky', value: 'kandinsky' },
                    { name: 'Absolutebeauty', value: 'absolutebeauty' }
                )
        ),
    async execute(interaction, guild, user) {
        await interaction.deferReply();
        if (user.imageGens < 1) return interaction.editReply(`${emojis.error} | Ваши генерации закончились! Поднимите бота на [BotiCord](https://boticord.top/bot/payzibot) для получения 15-ти генераций!\n\nКстати поднимать бота можно раз в 6 часов, а это 60 генераций в сутки :)`)

        const negative = "blury, bad quality, nsfw";
        const model = interaction.options.getString('модель');
        const text = interaction.options.getString('запрос');

        interaction.editReply(`${emojis.loading} | Генерируем картинку...`)

        async function AfterGen(image) {
            user.imageGens--;
            await user.save();
            interaction.editReply({
                content: `🖼️ Вот ваша замечательная картинка!\n-# Запрос: ${text.replace('`', '\`')}`,
                files: [{ attachment: Buffer.from(image, 'base64'), name: 'image.png' }]
            })
            CheckAch(9, interaction.user.id, interaction.channel, user)
        }

        if (model === 'sdxl') {
            await rsnchat.sdxl(text, negative)
                .then(response => {
                    AfterGen(response.image)
                }).catch(() => {
                    interaction.editReply(`${emojis.error} | Ошибка. Повторите свой запрос чуть позже, либо измените его!`)
                    return
                });
        } else if (model === 'kandinsky') {
            await rsnchat.kandinsky(text, negative)
                .then(response => {
                    AfterGen(response.image)
                }).catch(() => {
                    interaction.editReply(`${emojis.error} | Ошибка. Повторите свой запрос чуть позже, либо измените его!`)
                    return
                });
        } else {
            await rsnchat.absolutebeauty(text, negative)
                .then(response => {
                    AfterGen(response.image)
                }).catch(() => {
                    interaction.editReply(`${emojis.error} | Ошибка. Повторите свой запрос чуть позже, либо измените его!`)
                    return
                });
        }
    },
};
