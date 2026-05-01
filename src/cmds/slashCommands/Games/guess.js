const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Gen } = require('../../../func/games/tipGen.js');
const games = require('../../../func/games/guessCounting.js');
const give = require('../../../func/games/guessUserCorrect.js');
const logo = require('../../../games_src/guess/logos.json');
const gamesData = require('../../../games_src/guess/games.json');

module.exports = {
    category: 'games',
    cooldown: 9,
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
        ),
    async execute(interaction, guild) {
        await interaction.deferReply();

        if (interaction.options.getSubcommand() === 'logo') {
            const name = 'logo';

            const category = interaction.options.getString('category');
            const pool = category
                ? logo.filter(entry => entry.category === category)
                : logo;

            if (!pool.length) {
                return interaction.editReply({ content: '❌ В этой категории нет логотипов.' });
            }

            const item = pool[Math.floor(Math.random() * pool.length)];
            const image = item.images[Math.floor(Math.random() * item.images.length)];

            const collectorFilter = response => {
                return item.answers.some(
                    answer => answer.toLowerCase() === response.content.toLowerCase()
                );
            };

            games.gameGiveAll(name, item.id);
            const percent = await games.gameGetPercent(name, item.id);

            let podsk = '';
            if (percent < 50) podsk = '\nПодсказка: **' + Gen(item.answers[0]) + '**';

            const categoryLabel = item.category ? `\`${item.category}\`` : '';

            const embed = new EmbedBuilder()
                .setTitle(`Угадайте логотип`)
                .setDescription(`У вас есть **15 секунд** чтобы угадать, чей логотип в категории ${categoryLabel} изображен на фото ниже${podsk}`)
                .setImage(image)
                .setFooter({ text: `Логотип угадали ${percent}% пользователей` })
                .setColor(guild.colors.basic);

            interaction.editReply({ embeds: [embed], fetchReply: true })
                .then(() => {
                    interaction.channel
                        .awaitMessages({ filter: collectorFilter, max: 1, time: 15000, errors: ['time'] })
                        .then(collected => {
                            const embed1 = new EmbedBuilder()
                                .setTitle(`Угадайте логотип`)
                                .setDescription(`Ответ: **${item.answers[0]}**`)
                                .setImage(image)
                                .setColor(guild.colors.correct);

                            interaction.followUp({
                                content: `Победитель: **${collected.first().author}**`,
                                embeds: [embed1],
                            });
                            give.Correct('logo', collected.first().author.id);
                            games.gameGiveVerno(name, item.id);
                        })
                        .catch(() => {
                            const embed5 = new EmbedBuilder()
                                .setTitle(`Угадайте логотип`)
                                .setDescription(`Ответ: **${item.answers[0]}**`)
                                .setImage(image)
                                .setColor(guild.colors.error);

                            interaction.followUp({ content: 'К сожалению, победителей нет...', embeds: [embed5] });
                        });
                });
        }

        if (interaction.options.getSubcommand() === 'game') {
            const name = 'game';

            const item = gamesData[Math.floor(Math.random() * gamesData.length)];
            const image = item.images[Math.floor(Math.random() * item.images.length)];

            const collectorFilter = response => {
                return item.answers.some(
                    answer => answer.toLowerCase() === response.content.toLowerCase()
                );
            };

            games.gameGiveAll(name, item.id);
            const percent = await games.gameGetPercent(name, item.id);

            let podsk = '';
            if (percent < 50) podsk = '\nПодсказка: **' + Gen(item.answers[0]) + '**';

            const embed = new EmbedBuilder()
                .setTitle(`Угадайте игру`)
                .setDescription(`У вас есть **15 секунд** чтобы угадать игру по скриншоту ниже${podsk}`)
                .setImage(image)
                .setFooter({ text: `Игру угадали ${percent}% пользователей` })
                .setColor(guild.colors.basic);

            interaction.editReply({ embeds: [embed], fetchReply: true })
                .then(() => {
                    interaction.channel
                        .awaitMessages({ filter: collectorFilter, max: 1, time: 15000, errors: ['time'] })
                        .then(collected => {
                            const embed1 = new EmbedBuilder()
                                .setTitle(`Угадайте игру`)
                                .setDescription(`Ответ: **${item.answers[0]}**`)
                                .setImage(image)
                                .setColor(guild.colors.correct);

                            interaction.followUp({
                                content: `Победитель: **${collected.first().author}**`,
                                embeds: [embed1],
                            });
                            give.Correct('game', collected.first().author.id);
                            games.gameGiveVerno(name, item.id);
                        })
                        .catch(() => {
                            const embed5 = new EmbedBuilder()
                                .setTitle(`Угадайте игру`)
                                .setDescription(`Ответ: **${item.answers[0]}**`)
                                .setImage(image)
                                .setColor(guild.colors.error);

                            interaction.followUp({ content: 'К сожалению, победителей нет...', embeds: [embed5] });
                        });
                });
        }
    },
};