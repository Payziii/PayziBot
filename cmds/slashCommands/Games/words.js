const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	skip: true,
	cooldown: 60,
	data: new SlashCommandBuilder()
		.setName('words')
		.setDescription('Игра в слова'),
	async execute(interaction, guild) {
		await interaction.deferReply();

		let users = [];

		const expiredTimestamp = Math.round(Date.now() / 1000) + 60;
		const embed = new EmbedBuilder()
			.setTitle('Набор в игру: Слова')
			.setDescription(`Нажмите на **кнопку** ниже, чтобы участвовать в игре\n\nНабор окончится: <t:${expiredTimestamp}:R>`)
			.setColor(guild.colors.basic);
		const change_button = new ButtonBuilder()
			.setCustomId('change_button')
			.setLabel('Играть!')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(change_button);

		await interaction.editReply({ embeds: [embed], components: [row] });

		const collectorFilter = i => i.customId === 'change_button';

		const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });

		collector.on('collect', async (button) => {
			await button.reply({ content: '1', ephemeral: true });
			if(users.includes(button.user.id)) return await button.reply({ content: '<:no:1107254682100957224> | Вы уже участвуете в игре!', ephemeral: true });
			users.push(button.user.id)

			if(users.length >= 2) collector.stop();
		});

		collector.on('end', async () => {
			await interaction.channel.send('15');
		});


	},
};
