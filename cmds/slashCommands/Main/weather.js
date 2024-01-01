const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Узнать погоду')
		.addStringOption((option) =>
			option
				.setName('город')
				.setDescription('Город, погоду в котором надо узнать')
				.setRequired(true),
		),
	async execute(interaction, guild) {
		const city = interaction.options.getString('город');
		await interaction.deferReply();

		await require('node-fetch')(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER}&q=${encodeURIComponent(city)}&lang=ru`).then(r => r.json()).then(r => {
			if(r.error) {
				if(r.error.code == 1006) return interaction.editReply(`<:no:1107254682100957224> | Город не найден!`);
				interaction.editReply(`<:no:1107254682100957224> | Ошибка получения данных: \`${r.error.message}\``);
			}
			const embed = new EmbedBuilder()
				.setTitle(r.location.name + ", " + r.location.country)
				.setDescription(`<:arrow:1140937463209152572> ${r.current.condition.text}`)
				.addFields(
					{
						name: 'Температура',
						value: `Сейчас: **${r.current.temp_c || '?'}°C**\nПо ощущениям: **${r.current.feelslike_c || '?'}°C**`,
						inline: true,
					},
					{
						name: 'Прочее',
						value: `Влажность: **${r.current.humidity}%**\nВетер: **${(r.current.wind_kph/3.6).toFixed(1)} м/с**\nДавление: **${r.current.pressure_mb} мм рт. ст.**`,
						inline: false,
					},
				)
				.setThumbnail("https:" + r.current.condition.icon)
				.setColor(guild.colors.basic)
				.setFooter({
					text: 'Сервис: WeatherApi 💖',
				});

			interaction.editReply({ embeds: [embed] });
		})
			.catch(e => {
				interaction.editReply(`<:no:1107254682100957224> | Ошибка: \`${e}\``);
			});
	},
};
