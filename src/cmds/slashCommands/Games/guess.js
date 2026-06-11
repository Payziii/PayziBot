const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { Gen } = require('../../../func/games/tipGen.js');
const games = require('../../../func/games/guessCounting.js');
const give = require('../../../func/games/guessUserCorrect.js');
const logo = require('../../../games_src/guess/logos.json');
const gamesData = require('../../../games_src/guess/games.json');
const countriesData = require('../../../games_src/guess/countries.json');

function makeNextRow() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('guess_next')
            .setLabel('Дальше')
            .setStyle(ButtonStyle.Primary)
    );
}

async function playGuessLoop(interaction, guild, subcommand, category) {
    let cur = interaction;

    while (true) {
        let item, image, fact, collectorFilter, questionEmbed, resultTitle, name, time;

        if (subcommand === 'logo') {
            name = 'logo';
            time = 15000;
            const pool = category ? logo.filter(e => e.category === category) : logo;
            if (!pool.length) {
                await cur.editReply({ content: '❌ В этой категории нет логотипов.' });
                break;
            }
            item = pool[Math.floor(Math.random() * pool.length)];
            image = item.images[Math.floor(Math.random() * item.images.length)];
            resultTitle = 'Угадайте логотип';
            collectorFilter = r => item.answers.some(a => a.toLowerCase() === r.content.toLowerCase());

            games.gameGiveAll(name, item.id);
            const pLogo = await games.gameGetPercent(name, item.id);
            const podskLogo = pLogo < 50 ? '\nПодсказка: **' + Gen(item.answers[0]) + '**' : '';
            const catLabel = item.category ? `\`${item.category}\`` : '';

            questionEmbed = new EmbedBuilder()
                .setTitle('Угадайте логотип')
                .setDescription(`У вас есть **15 секунд** чтобы угадать, чей логотип в категории ${catLabel} изображен на фото ниже${podskLogo}`)
                .setImage(image)
                .setFooter({ text: `Логотип угадали ${pLogo}% пользователей` })
                .setColor(guild.colors.basic);

        } else if (subcommand === 'game') {
            name = 'game';
            time = 15000;
            item = gamesData[Math.floor(Math.random() * gamesData.length)];
            image = item.images[Math.floor(Math.random() * item.images.length)];
            resultTitle = 'Угадайте игру';
            collectorFilter = r => item.answers.some(a => a.toLowerCase() === r.content.toLowerCase());

            games.gameGiveAll(name, item.id);
            const pGame = await games.gameGetPercent(name, item.id);
            const podskGame = pGame < 50 ? '\nПодсказка: **' + Gen(item.answers[0]) + '**' : '';

            questionEmbed = new EmbedBuilder()
                .setTitle('Угадайте игру')
                .setDescription(`У вас есть **15 секунд** чтобы угадать игру по скриншоту ниже${podskGame}`)
                .setImage(image)
                .setFooter({ text: `Игру угадали ${pGame}% пользователей` })
                .setColor(guild.colors.basic);

        } else if (subcommand === 'country') {
            name = 'country';
            time = 30000;
            item = countriesData[Math.floor(Math.random() * countriesData.length)];
            image = item.images[Math.floor(Math.random() * item.images.length)];
            fact = item.facts[Math.floor(Math.random() * item.facts.length)];
            resultTitle = 'Угадайте страну';
            collectorFilter = r => item.answers.some(a => a.toLowerCase() === r.content.toLowerCase());

            games.gameGiveAll(name, item.id);
            const pCountry = await games.gameGetPercent(name, item.id);
            const podskCountry = pCountry < 50 ? '\nПодсказка: **' + Gen(item.answers[0]) + '**' : '';

            questionEmbed = new EmbedBuilder()
                .setTitle('Угадайте страну')
                .setDescription(`У вас есть **30 секунд** чтобы угадать страну по фото из Google-карт и факту ниже\n📌 Факт: *${fact}*${podskCountry}`)
                .setImage(image)
                .setFooter({ text: `Страну угадали ${pCountry}% пользователей` })
                .setColor(guild.colors.basic);

        } else {
            break;
        }

        await cur.editReply({ embeds: [questionEmbed] });

        let resultMessage;
        try {
            const collected = await cur.channel.awaitMessages({
                filter: collectorFilter,
                max: 1,
                time,
                errors: ['time'],
            });

            const winEmbed = new EmbedBuilder()
                .setTitle(resultTitle)
                .setDescription(`Ответ: **${item.answers[0]}**`)
                .setImage(image)
                .setColor(guild.colors.correct);

            resultMessage = await cur.followUp({
                content: `Победитель: **${collected.first().author}**`,
                embeds: [winEmbed],
                components: [makeNextRow()],
                fetchReply: true,
            });

            give.Correct(name, collected.first().author.id);
            games.gameGiveCorrect(name, item.id);

        } catch {
            const loseEmbed = new EmbedBuilder()
                .setTitle(resultTitle)
                .setDescription(`Ответ: **${item.answers[0]}**`)
                .setImage(image)
                .setColor(guild.colors.error);

            resultMessage = await cur.followUp({
                content: 'К сожалению, победителей нет...',
                embeds: [loseEmbed],
                components: [makeNextRow()],
                fetchReply: true,
            });
        }

        try {
            const btn = await resultMessage.awaitMessageComponent({
                filter: i => i.customId === 'guess_next',
                time: 60000,
            });

            await resultMessage.edit({ components: [] }).catch(() => {});
            await btn.deferReply();
            cur = btn;
        } catch {
            await resultMessage.edit({ components: [] }).catch(() => {});
            break;
        }
    }
}

module.exports = {
    category: 'games',
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Угадайте что-то по картинке')
        .addSubcommand(subcommand =>
            subcommand
                .setName('logo')
                .setDescription('Угадайте логотип')
                .addStringOption(option =>
                    option
                        .setName('category')
                        .setDescription('Категория логотипов')
                        .setRequired(false)
                        .addChoices(
                            { name: 'ИИ', value: 'ai' },
                            { name: 'Программное обеспечение', value: 'software' },
                            { name: 'ОС', value: 'os' },
                            { name: 'Авто', value: 'auto' },
                        )
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('game')
                .setDescription('Угадайте игру по скриншоту')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('country')
                .setDescription('Угадайте страну по фото и факту')
        ),
    async execute(interaction, guild) {
        await interaction.deferReply();
        await playGuessLoop(
            interaction,
            guild,
            interaction.options.getSubcommand(),
            interaction.options.getString('category')
        );
    },
};
