const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../../database/user.js');

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
			.setDescription("Блокировка: **Имеет доступ к PayziBot**")
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
			  );

			  await interaction.editReply({ embeds: [embed] });
	},
};
