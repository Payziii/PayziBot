const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const tr = require('googletrans').default;

module.exports = {
    cooldown: 3,
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Переводчик')
        .addStringOption((option) =>
            option.setName('язык')
            .setDescription('Язык, на который надо перевести')
            .setRequired(true)
            .addChoices(
                { name: 'Английский', value: "en" },
                { name: 'Русский', value: "ru" },
                { name: 'Украинский', value: "uk" },
                { name: 'Немецкий', value: "de" },
                { name: 'Японский', value: "ja" },
                { name: 'Китайский', value: "zh" },
                { name: 'Португальский', value: "pt" },
                { name: 'Казахский', value: "kk" },
                { name: 'Турецкий', value: "tr" },
                { name: 'Французский', value: "fr" },
                { name: 'Арабский', value: "ar" },
                { name: 'Испанский', value: "es" },
            )
        )
        .addStringOption((option) =>
        option.setName('текст')
        .setDescription('Текст, который надо перевести')
        .setRequired(true)
    ),
    async execute(interaction, guild) {
        await interaction.deferReply();
        lang = interaction.options.getString('язык')
        text = interaction.options.getString('текст')
        
        tr(text, lang)
        .then(function (result) {
            if(result.text.length > 1000) return interaction.editReply(`<:no:1107254682100957224> | Текст перевода содержит слишком много символов. Его длина равна ${result.text.length} символов. Уменьшите длину до 1000 символов!`);
            let t = text;
            if(result.hasCorrectedText === true) t = result.correctedText;

            const embed = new EmbedBuilder()
            .setColor(guild.colors.basic)
            .setTitle("Переводчик")
            .setDescription(result.text || "Текст отсутствует")
            .setThumbnail("https://cdn.discordapp.com/attachments/695277643360239616/772322213394120714/1492616968-18-google-translate-text-language-translation_83413.png");
        
            interaction.editReply({ embeds: [embed] });
          },
          function(error) {
            interaction.editReply(`<:no:1107254682100957224> | Ошибка: \`${error}\``);
          })
    },
};
