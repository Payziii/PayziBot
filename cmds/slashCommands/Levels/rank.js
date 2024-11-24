const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const create = require('../../../func/levelCard.js');
const User = require('../../../database/user.js');
const block = require('../../../games_src/profile/block.json');
const ach = require('../../../games_src/profile/achievements.json');
const { emojis } = require('../../../config.js');
const fs = require('fs');
const { join } = require('path');
const { getLevelGuild, getLevelUserByGuild, MathNextLevel } = require('../../../database/levels.js');

module.exports = {
    category: 'levels',
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Посмотреть текущий уровень')
        .addUserOption((option) =>
            option
                .setName('user') // Изменено имя опции
                .setDescription('Пользователь, чей уровень надо посмотреть')
        ),
    async execute(interaction, guild) {
        await interaction.deferReply();
        let _user = interaction.options.getUser('user') || interaction.user; // Изменено имя опции

        let user = await User.findOne({ userID: _user.id });
        if (!user) return interaction.editReply(`${emojis.error} | Этот пользователь не использовал бота!`);
        let lvlMess;
        const g = await getLevelGuild(interaction.guild.id);
        if (!g.enabled) return interaction.editReply('На сервере отключена система уровней');

        const us = await getLevelUserByGuild(interaction.guild.id, _user.id);
        lvlMess = `Уровень: **${us.level}**\nXP: **${us.xp}**/**${MathNextLevel(us.level, g.xp.koeff)}**`;
        let prosh = MathNextLevel(us.level - 1, g.xp.koeff);
        if (prosh < 0) prosh = 0;
        let prog = (us.xp - prosh) / (MathNextLevel(us.level, g.xp.koeff) - prosh);
        let avatar = _user.displayAvatarURL({ extension: 'jpg' });
        let canvas = await create(_user.username, us.level, prog, avatar);
        let img = await canvas.encode('png');

        const filePath = join(__dirname, 'simple.png');

        try {
            // Создание и запись данных в файл
            fs.writeFileSync(filePath, img);
            console.log('File has been created:', filePath);

            // Проверка существования файла
            if (!fs.existsSync(filePath)) {
                throw new Error('File does not exist after creation');
            }

            // Отправка файла в канал Discord
            const attachment = new AttachmentBuilder(filePath, { name: 'example.png' });
            await interaction.editReply({
                content: `${lvlMess}`,
                files: [attachment]
            });

            // Удаление файла после успешной отправки
            fs.unlinkSync(filePath);
            console.log('File has been deleted');
        } catch (err) {
            console.error('Error:', err);
            interaction.editReply('Произошла ошибка при обработке запроса.');
        }
    },
};
