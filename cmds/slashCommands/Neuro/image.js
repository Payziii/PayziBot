const { SlashCommandBuilder } = require("discord.js");
const { CheckAch } = require('../../../func/games/giveAch.js');

const { RsnChat } = require('rsnchat');
const rsnchat = new RsnChat(process.env.RSN);

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
    async execute(interaction, guild, user) {
        await interaction.deferReply();
        if (user.imageGens < 1) return interaction.editReply('<:no:1107254682100957224> | Ваши генерации закончились! Поднимите бота на [BotiCord](https://boticord.top/bot/payzibot) для получения 15-ти генераций!\n\nКстати поднимать бота можно раз в 6 часов, а это 60 генераций в сутки :)')

        const text = interaction.options.getString('запрос');

        interaction.editReply(`<a:loading:673777314584199169> | Генерируем картинку...`)

        rsnchat.kandinsky(text, "blury, bad quality, nsfw")
            .then(response => {
                user.imageGens--;
                user.save();
                interaction.editReply({
                    content: '🖼️ Вот ваша замечательная картинка:',
                    files: [{ attachment: Buffer.from(response.image, 'base64'), name: 'image.png' }]
                  })
                CheckAch(9, interaction.user.id, interaction.channel, user)
            }).catch(() => {
                interaction.editReply('<:no:1107254682100957224> | Ошибка. Повторите свой запрос чуть позже, либо измените его!')
                return 
              });
    },
};
