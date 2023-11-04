const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Minesweeper } = require('discord-gamecord');

module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('minesweeper')
        .setDescription('Игра в сапёра'),
    async execute(interaction, guild) {
        await interaction.deferReply();

        const Game = new Minesweeper({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Сапёр',
              color: guild.colors.basic,
              description: 'Нажимайте на кнопки ниже, чтобы открывать поле'
            },
            emojis: { flag: '🚩', mine: '💣' },
            mines: 5,
            timeoutTime: 60000,
            winMessage: 'Вы выиграли! Вы успешно нашли все мины',
            loseMessage: 'Вы подорвались!',
            playerOnlyMessage: 'Эта игра предназначена для {player}'
          });
          
          Game.startGame();
    },
};
