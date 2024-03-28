const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { emojis } = require('../../../config.js');

module.exports = {
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('bio')
		.setDescription('Установить информацию о себе')
		.addStringOption((option) =>
			option.setName('осебе')
				.setDescription('Напишите что-то о себе')
				.setMaxLength(64)
				.setRequired(true),
		),
	async execute(interaction, guild, user) {
		await interaction.deferReply();
		const text = interaction.options.getString('осебе');

		user.bio = text.replaceAll('`', '\`');
		await user.save();
		interaction.editReply(`${emojis.success} Успешно изменено. Изменения можно посмотреть выполнив команду \`/profile\``)
	},
};
