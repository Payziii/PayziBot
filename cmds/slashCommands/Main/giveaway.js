const { SlashCommandBuilder, ChannelType } = require('discord.js');
const ms = require('../../../func/ms.js');
const messages = require('../../../games_scr/giveaways/messages.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('Управление розыгрышами')
		.addSubcommand(subcommand =>
			subcommand
				.setName('start')
				.setDescription('Начать розыгрыш')
				.addStringOption((option) =>
				option
					.setName('время')
					.setDescription('Время (с, м, ч, д)')
					.setRequired(true))
				.addStringOption((option) =>
				option
					.setName('приз')
					.setDescription('Приз')
					.setRequired(true))
				.addIntegerOption((option) =>
				option
					.setName('победители')
					.setDescription('Количество победителей (1-50)')
					.setMinValue(1)
					.setMaxValue(50)
					.setRequired(true))
				.addChannelOption((option) =>
				option
					.setName('канал')
					.addChannelTypes(ChannelType.GuildText)
					.setDescription('Канал, в котором будет создан розыгрыш'))
				)
		.addSubcommand(subcommand =>
			subcommand
				.setName('reroll')
				.setDescription('Выбрать нового победителя')
				.addStringOption((option) =>
				option
					.setName('айди')
					.setDescription('ID сообщения')
					.setRequired(true))
		),
	async execute(interaction, guild) {
		if (interaction.options.getSubcommand() === 'start') {
			channel = interaction.options.getChannel('канал') || interaction.channel;
			duration = interaction.options.getString('время');
			winnerCount = interaction.options.getInteger('победители');
    		prize = interaction.options.getString('приз');

			interaction.client.giveawaysManager
            .start(interaction.channel, {
                duration: ms(duration),
                winnerCount,
                prize,
				messages: messages.start
            })
		}
	},
};
