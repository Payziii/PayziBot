const { SlashCommandBuilder, ChannelType } = require('discord.js');
const ms = require('../../../func/ms.js');
const messages = require('../../../games_src/giveaways/messages.js');
const giveaway = require('../../../database/giveaway.js');
const { CheckAch } = require('../../../func/games/giveAch.js');
const { emojis } = require('../../../config.js');

module.exports = {
	category: 'settings',
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
				.addStringOption((option) =>
					option
						.setName('реакция')
						.setDescription('Реакция, которую необходимо нажать для участия'))
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('reroll')
				.setDescription('Выбрать нового победителя')
				.addStringOption((option) =>
					option
						.setName('айди')
						.setDescription('ID сообщения/розыгрыша')
						.setRequired(true))
		).addSubcommand(subcommand =>
			subcommand
				.setName('end')
				.setDescription('Закончить розыгрыш раньше времени')
				.addStringOption((option) =>
					option
						.setName('айди')
						.setDescription('ID сообщения/розыгрыша')
						.setRequired(true))
		),
	async execute(interaction, guild) {
		if (interaction.options.getSubcommand() === 'start') {

			channel = interaction.options.getChannel('канал') || interaction.channel;
			duration = interaction.options.getString('время');
			winnerCount = interaction.options.getInteger('победители');
			prize = interaction.options.getString('приз');
			react = interaction.options.getString('реакция') || "🎉";

			duration = ms(duration);

			if(!channel.permissionsFor(interaction.user).has("SendMessages")) return interaction.reply(`${emojis.error} | Для создания розыгрыша вам необходимо иметь право \`Отправлять сообщения\` в выбранном канале!`)

			if (!channel.permissionsFor(interaction.guild.members.me).has(['SendMessages', 'AddReactions', 'ViewChannel'])) return interaction.reply(`${emojis.error} | Для создания розыгрыша мне необходимо иметь права \`Отправлять сообщения\`, \`Добавлять реакции\` и \`Просматривать канал\` в выбранном канале!`)

			if(isNaN(duration)) return interaction.reply(`${emojis.error} | Время - это число. Также можете использовать приставки "с", "м", "ч", "д". Например: 1д - розыгрыш будет создан на 1 день.`)
			if(duration < 1000) return interaction.reply(`${emojis.error} | Я не могу создать розыгрыш менее, чем на 1 секунду`)
			
			const isUnicodeEmoji = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u.test(react);
			const isDiscordEmoji = /^<a?:\w+:\d+>$/.test(react);

			if (!isUnicodeEmoji && !isDiscordEmoji) {
				return interaction.reply(`${emojis.error} | Я думаю \`${react}\` не является эмодзи...`)
			}

			let msgs = messages.ru.start;

			await interaction.reply(`${emojis.loading} | Создание розыгрыша`)
			interaction.client.giveawaysManager
				.start(channel, {
					duration: duration,
					winnerCount,
					prize,
					hostedBy: interaction.user,
					reaction: react,
					messages: msgs,
					embedColor: guild.colors.giveaway,
					embedColorEnd: guild.colors.giveaway
				}).then((data) => {
					interaction.editReply(`${emojis.gift} | Розыгрыш начался. ID розыгрыша: \`${data.messageId}\`\n-# Сохраните ID для выбора нового победителя или досрочного окончания`)
					CheckAch(8, interaction.user.id, interaction.channel)
				}).catch((err) => {
					console.log(err)
					interaction.editReply(`${emojis.error} | Неизвестная ошибка`)
				});

		} else if (interaction.options.getSubcommand() === 'reroll') {

			id = interaction.options.getString('айди');

			let _giveaway = await interaction.client.giveawaysManager.giveaways.find((g) => g.messageId === id && g.guildId === interaction.guild.id);
			if (!_giveaway) return interaction.reply(`${emojis.error} | Розыгрыш не найден!`);
			if (!_giveaway.ended) return interaction.reply(`${emojis.error} | Этот розыгрыш еще не завершен!`);
			if(_giveaway.hostedBy != `<@${interaction.user.id}>`) return interaction.reply(`${emojis.error} | Не вы начали этот розыгрыш!`);

			await interaction.reply(`${emojis.loading} | Выбор новых победителей`)
			interaction.client.giveawaysManager
				.reroll(id, {
					winnerCount: 1,
					messages: messages.ru.reroll
				}).then(() => {
					interaction.editReply(`${emojis.gift} | Успешно выбраны новые победители`)
				}).catch((err) => {
					console.log(err)
					interaction.editReply(`${emojis.error} | Неизвестная ошибка`)
				});
		}else if (interaction.options.getSubcommand() === 'end') {

			id = interaction.options.getString('айди');

			let _giveaway = await interaction.client.giveawaysManager.giveaways.find((g) => g.messageId === id && g.guildId === interaction.guild.id);
			if (!_giveaway) return interaction.reply(`${emojis.error} | Розыгрыш не найден!`);
			if (_giveaway.ended) return interaction.reply(`${emojis.error} | Этот розыгрыш уже завершен!`);
			if(_giveaway.hostedBy != `<@${interaction.user.id}>`) return interaction.reply(`${emojis.error} | Не вы начали этот розыгрыш!`);

			await interaction.reply(`${emojis.loading} | Завершение розыгрыша`)
			interaction.client.giveawaysManager.end(_giveaway.messageId)
			.then(() => {
				interaction.editReply(`${emojis.gift} | Розыгрыш успешно завершен`)
			}).catch((err) => {
				console.log(err)
				interaction.editReply(`${emojis.error} | Произошли технические неполадки, но мы уже работаем над их устранением!`)
			});
		}
	},
};
