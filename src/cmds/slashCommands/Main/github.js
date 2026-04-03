/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { emojis } = require('../../../config.js');
const plural = require('../../../func/plural.js');

module.exports = {
    category: 'utility',
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Посмотреть пользователя на GitHub')
        .addStringOption((option) =>
            option
                .setName('ник')
                .setDescription('Юзернейм пользователя на GitHub.')
                .setRequired(true)
                .setMaxLength(39),
        ),
    async execute(interaction, guild) {
        await interaction.deferReply();
        const query = interaction.options.getString('ник');
        let bio = 'Отсутствует', name = 'Отсутствует', blog = 'Отсутствует';
        let login, repos, html_url, id, avatar, fl, msg;

        await fetch(`https://api.github.com/users/${query}`).then(r => r.json()).then(r => {
            if (r.message && r.message == 'Not Found') return msg = true;
            if (r.bio) bio = r.bio;
            if (r.name) name = r.name;
            if (r.blog) {
                if (r.blog.startsWith('http') == false) blog = `https://${r.blog}`;
                else blog = `${r.blog}`;
            }
            login = r.login;
            repos = r.public_repos;
            fl = r.followers;
            html_url = r.html_url;
            id = r.id;
            avatar = r.avatar_url;
        });

        if (msg) return interaction.editReply(`${emojis.error} | Ничего не найдено!`);

        const embed = new EmbedBuilder()
            .setTitle(`Пользователь ${login}`)
            .setURL(html_url)
            .setDescription(`${emojis.arrow} Публичных репозиториев: **${repos}**\n${emojis.arrow} Подписчиков: **${fl}**\n${emojis.arrow} Имя: **${name}**\n${emojis.arrow} Биография: **${bio}**\n${emojis.arrow} Сайт: **${blog}**`)
            .setThumbnail(avatar)
            .setColor(guild.colors.basic)
            .setFooter({ text: `ID: ${id}` });

        const repos_button = new ButtonBuilder()
            .setCustomId('repos_button')
            .setLabel('Репозитории пользователя')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(repos_button);
        const response = await interaction.editReply({ embeds: [embed], components: [row] });
        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            let allRepos = [];
            let page = 1;
            while (true) {
                const batch = await fetch(`https://api.github.com/users/${query}/repos?per_page=100&page=${page}`).then(r => r.json());
                if (!batch.length) break;
                allRepos = allRepos.concat(batch);
                if (batch.length < 100) break;
                page++;
            }

            const PER_PAGE = 10;
            const totalPages = Math.max(1, Math.ceil(allRepos.length / PER_PAGE));
            let currentPage = 0;

            const buildReposEmbed = (pageIndex) => {
                const start = pageIndex * PER_PAGE;
                const slice = allRepos.slice(start, start + PER_PAGE);

                const desc = slice.length
                    ? slice.map((r, i) =>
                        `${start + i + 1}. **${r.name}**: ${r.stargazers_count} ${emojis.github_star} | ${r.forks_count} ${emojis.github_fork}`
                    ).join('\n')
                    : '**Репозитории отсутствуют**';

                return new EmbedBuilder()
                    .setTitle(`Репозитории ${login}`)
                    .setURL(html_url)
                    .setDescription(desc)
                    .setThumbnail(avatar)
                    .setColor(guild.colors.basic)
                    .setFooter({ text: `Страница ${pageIndex + 1} из ${totalPages}` });
            };

            const buildPaginationRow = (pageIndex) => {
                const prev = new ButtonBuilder()
                    .setCustomId('page_prev')
                    .setLabel('◀ Назад')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(pageIndex === 0);

                const next = new ButtonBuilder()
                    .setCustomId('page_next')
                    .setLabel('Вперёд ▶')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(pageIndex >= totalPages - 1);

                return new ActionRowBuilder().addComponents(prev, next);
            };

            await confirmation.update({
                embeds: [buildReposEmbed(currentPage)],
                components: totalPages > 1 ? [buildPaginationRow(currentPage)] : [],
            });

            if (totalPages > 1) {
                const pageCollector = response.createMessageComponentCollector({
                    filter: collectorFilter,
                    time: 120_000,
                });

                pageCollector.on('collect', async (i) => {
                    if (i.customId === 'page_prev') currentPage--;
                    if (i.customId === 'page_next') currentPage++;

                    await i.update({
                        embeds: [buildReposEmbed(currentPage)],
                        components: [buildPaginationRow(currentPage)],
                    });
                });

                pageCollector.on('end', async () => {
                    await interaction.editReply({
                        embeds: [buildReposEmbed(currentPage)],
                        components: [],
                    }).catch(() => {});
                });
            }
        } catch (e) {
            await interaction.editReply({ embeds: [embed], components: [] });
        }
    },
};