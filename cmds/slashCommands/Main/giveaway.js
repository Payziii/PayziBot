const { SlashCommandBuilder, ChannelType } = require('discord.js');
const ms = require('../../../func/ms.js');
const messages = require('../../../games_scr/giveaways/messages.js');
const giveaway = require('../../../database/giveaway.js');

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
						.setDescription('ID сообщения/конкурса')
						.setRequired(true))
		),
	async execute(interaction, guild) {
		if (interaction.options.getSubcommand() === 'start') {

			channel = interaction.options.getChannel('канал') || interaction.channel;
			duration = interaction.options.getString('время');
			winnerCount = interaction.options.getInteger('победители');
			prize = interaction.options.getString('приз');

			interaction.reply(`<a:loading:673777314584199169> | Создание розыгрыша`)
			interaction.client.giveawaysManager
				.start(interaction.channel, {
					duration: ms(duration),
					winnerCount,
					prize,
					messages: messages.start,
					embedColor: guild.colors.giveaway,
					embedColorEnd: guild.colors.giveaway
				}).then((data) => {
					interaction.editReply(`<:Gift:1189196716373725235> | Розыгрыш начался. ID конкурса: \`${data.messageId}\` (сохраните его для выбора нового победителя или досрочного окончания)`)
				}).catch((err) => {
					console.log(err)
					interaction.editReply(`<:no:1107254682100957224> | Неизвестная ошибка`)
				});

		} else if (interaction.options.getSubcommand() === 'reroll') {

			id = interaction.options.getString('айди');

			let _giveaway = await interaction.client.giveawaysManager.giveaways.find((g) => g.messageId === id && g.guildId === interaction.guild.id);
			if (!_giveaway) return interaction.reply(`<:no:1107254682100957224> | Розыгрыш не найден!`);

			interaction.reply(`<a:loading:673777314584199169> | Выбор новых победителей`)
			interaction.client.giveawaysManager
				.reroll(id, {
					messages: messages.reroll
				}).then(() => {
					interaction.editReply(`<:Gift:1189196716373725235> | Успешно выбран новые победители`)
				}).catch((err) => {
					console.log(err)
					interaction.editReply(`<:no:1107254682100957224> | Неизвестная ошибка`)
				});
		}
	},
};
