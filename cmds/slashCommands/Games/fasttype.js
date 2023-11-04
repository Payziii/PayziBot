const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { FastType } = require('../../../func/discord-gamecord');
const fasttype = require('../../../games_scr/fasttype.json')

module.exports = {
    cooldown: 30,
    data: new SlashCommandBuilder()
        .setName('typing')
        .setDescription('Проверить скорость набора текста'),
    async execute(interaction, guild) {
        await interaction.deferReply();
        
        const item = fasttype[Math.floor(Math.random() * fasttype.length)];

        const Game = new FastType({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Скорость набора текста',
              color: guild.colors.basic,
              description: 'У вас есть {time} секунд чтобы ввести данный текст:'
            },
            timeoutTime: 30000,
            sentence: item,
            winMessage: 'Ура! Вы ввели текст за {time} секунд. Ваша скорость {wpm} слов в минуту.',
            loseMessage: 'Вы не успели ввести текст за указанное время...',
          });
          
          Game.startGame();
    },
};
