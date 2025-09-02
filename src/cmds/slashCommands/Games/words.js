const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { emojis } = require('../../../config.js');
const words = require('../../../games_src/words.json');

module.exports = {
    category: 'games',
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('longwords')
        .setDescription('Игра в "Длинное слово"'),
    async execute(interaction, guild) {
        await interaction.deferReply();

        let users = [];

        const expiredTimestamp = Math.round(Date.now() / 1000) + 60;
        const embed = new EmbedBuilder()
            .setTitle('Набор в игру: Длинное слово')
            .setDescription(`Нажмите на кнопку ниже, чтобы участвовать в игре.\n\nПобеждает тот, кто первым наберет 30+ очков. Очки — это сумма символов в ваших правильных ответах.\nНабор окончится: <t:${expiredTimestamp}:R>`)
            .setColor(guild.colors.basic);

        const join_button = new ButtonBuilder()
            .setCustomId('join_button')
            .setLabel('Играть!')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(join_button);

        await interaction.editReply({ embeds: [embed], components: [row] });

        const collectorFilter = i => i.customId === 'join_button';
        const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });

        collector.on('collect', async (button) => {
            if (users.includes(button.user.id)) {
                return await button.reply({ content: `${emojis.error} | Вы уже в игре!`, ephemeral: true });
            }

            users.push(button.user.id);
            await button.reply({ content: '✅ | Вы успешно присоединились к игре!', ephemeral: true });

            const updatedEmbed = EmbedBuilder.from(embed)
                .setDescription(`${embed.data.description}\n\n**Игроки (${users.length}/5):**\n${users.map(u => `<@${u}>`).join('\n')}`);
            await interaction.editReply({ embeds: [updatedEmbed] });

            if (users.length >= 5) {
                collector.stop();
            }
        });

        collector.on('end', async () => {
            join_button.setDisabled(true);
            await interaction.editReply({ components: [new ActionRowBuilder().addComponents(join_button)] });

            if (users.length < 2) {
                const cancelEmbed = new EmbedBuilder()
                    .setTitle('Набор отменен')
                    .setDescription('Недостаточно игроков для начала игры (нужно от 2 до 5).')
                    .setColor(guild.colors.error);
                return await interaction.followUp({ embeds: [cancelEmbed] });
            }

            const scores = new Map();
            users.forEach(userId => {
                scores.set(userId, 0);
            });

            const startEmbed = new EmbedBuilder()
                .setTitle('Игра "Длинное слово" начинается!')
                .setDescription(`**Участники:**\n${users.map(u => `<@${u}>`).join('\n')}`)
                .setColor(guild.colors.basic);
            await interaction.channel.send({ embeds: [startEmbed] });

            let availableQuestions = [...words];

            await gameRound();

            async function gameRound() {
                if (checkWinner()) {
                    return announceWinner();
                }

                if (availableQuestions.length === 0) {
                    return announceWinner('no_questions');
                }

                const questionIndex = Math.floor(Math.random() * availableQuestions.length);
                const currentQuestion = availableQuestions.splice(questionIndex, 1)[0];
                const correctAnswers = currentQuestion.answers.map(a => a.toLowerCase());

                const answeredInThisRound = new Set();

                const scoreBoard = Array.from(scores.entries())
                    .map(([userId, score]) => `<@${userId}>: **${score}**`)
                    .join('\n');
                
                const questionEmbed = new EmbedBuilder()
                    .setTitle(`Вопрос №${words.length - availableQuestions.length}`)
                    .setDescription(`**${currentQuestion.question}**`)
                    .addFields({ name: 'Текущий счет', value: scoreBoard || '0' })
                    .setColor(guild.colors.basic)
                    .setFooter({ text: 'У вас 15 секунд на ответ!' });
                await interaction.channel.send({ embeds: [questionEmbed] });

                const answerCollector = interaction.channel.createMessageCollector({
                    filter: m => users.includes(m.author.id),
                    time: 15000
                });

                answerCollector.on('collect', m => {
                    const userId = m.author.id;
                    if (answeredInThisRound.has(userId)) return;

                    const userAnswer = m.content.toLowerCase().trim();
                    if (correctAnswers.includes(userAnswer)) {
                        answeredInThisRound.add(userId);
                        const points = userAnswer.length;
                        scores.set(userId, scores.get(userId) + points);
                        m.react('✅');
                    }
                });

                answerCollector.on('end', () => {
                    setTimeout(gameRound, 3000);
                });
            }

            function checkWinner() {
                return Array.from(scores.values()).some(score => score >= 30);
            }

            async function announceWinner(reason = null) {
                const finalScores = Array.from(scores.entries())
                    .sort((a, b) => b[1] - a[1])
                    .map(([userId, score]) => `<@${userId}>: **${score} очков**`)
                    .join('\n');

                const winnerScore = Math.max(...scores.values());
                const winners = Array.from(scores.entries())
                                    .filter(([, score]) => score === winnerScore)
                                    .map(([userId]) => `<@${userId}>`);

                const endEmbed = new EmbedBuilder()
                    .setTitle('Игра окончена!')
                    .addFields({ name: 'Итоговый счет', value: finalScores })
                    .setColor(guild.colors.basic);

                if (reason === 'no_questions') {
                    endEmbed.setDescription(`Вопросы закончились! Победитель определен по максимальному количеству очков: ${winners.join(', ')}`);
                } else {
                     endEmbed.setDescription(`Поздравляем победителя: ${winners.join(', ')}!`);
                }
                
                await interaction.channel.send({ embeds: [endEmbed] });
            }
        });
    },
};