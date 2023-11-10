const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { MatchPairs } = require('../../../func/discord-gamecord');

module.exports = {
    cooldown: 30,
    data: new SlashCommandBuilder()
        .setName('pairs')
        .setDescription('Найдите пары'),
    async execute(interaction, guild) {
        await interaction.deferReply();

        const Game = new MatchPairs({
          message: interaction,
          isSlashGame: true,
          embed: {
            title: 'Найдите пару',
            color: guild.colors.basic,
            description: 'Кликайте на кнопки и находите одинаковые пары эмодзи!'
          },
          timeoutTime: 60000,
          emojis: ['❄️', '🎁', '🔗', '🔋', '🔥', '🍏', '💳', '💎', '🍓', '🎨', '🍍', '⛄', '🎩'],
          winMessage: 'Вы выиграли!',
          loseMessage: 'Вы проиграли. Как жаль...',
          playerOnlyMessage: 'Это игра пользователя {player}.'
        });
        
        Game.startGame();
    },
};
