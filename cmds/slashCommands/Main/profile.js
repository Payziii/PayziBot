const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const User = require('../../../database/user.js');
const block = require('../../../games_src/profile/block.json');
const ach = require('../../../games_src/profile/achievements.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Профиль PayziBot')
		.addUserOption((option) =>
			option
				.setName('пользователь')
				.setDescription('Пользователь, чей профиль надо посмотреть')
		),
	async execute(interaction, guild) {
		await interaction.deferReply();
		let _user = interaction.options.getUser('пользователь') || interaction.user;

		let user = await User.findOne({ userID: _user.id });
		if (!user) return interaction.editReply('<:no:1107254682100957224> | Этот пользователь не использовал бота!');

		const embed = new EmbedBuilder()
			.setTitle(`${_user.username}`)
			.setColor(guild.colors.basic)
			.setDescription(`Блокировка: **${block[user.block].name}**`)
			.setThumbnail(`https://cdn.discordapp.com/avatars/${_user.id}/${_user.avatar}.webp?size=4096`)
			.addFields(
				{
				  name: "Достижения",
				  value: `Всего достижений: **${user.ach.length}**`,
				  inline: false
				},
				{
				  name: "Игры",
				  value: `Побед в "угадай...": **${user.games.game + user.games.city + user.games.logo + user.games.flag}**`,
				  inline: false
				},
			  )
			  .setFooter({ text: `С новым годом! 🎄` });

			  const ach_button = new ButtonBuilder()
			.setCustomId('ach_button')
			.setLabel('Достижения')
			.setStyle(ButtonStyle.Secondary);
		const games_button = new ButtonBuilder()
			.setCustomId('games_button')
			.setLabel('Игры')
			.setStyle(ButtonStyle.Secondary);
		const row = new ActionRowBuilder()
			.addComponents(ach_button, games_button);

			let text = ach.filter(x => user.ach.includes(x.id)).map(x => `${x.badge} | ${x.name}`).join("\n");
			const ach_embed = new EmbedBuilder()
			.setTitle(`Достижения ${_user.username}`)
			.setThumbnail(`https://cdn.discordapp.com/avatars/${_user.id}/${_user.avatar}.webp?size=4096`)
			.setDescription(text || "Отсутствуют")
			.setColor(guild.colors.basic);

			const response = await interaction.editReply({ embeds: [embed], components: [row] });

			const collectorFilter = i => i.user.id === interaction.user.id;
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

			if (confirmation.customId === 'ach_button') {
				await interaction.editReply({ embeds: [ach_embed], components: [] });
			}
			else if (confirmation.customId === 'games_button') {
				await interaction.editReply({ content: 'Будет доступно уже совсем скоро)))', embeds: [], components: [] });
			}
	},
};
