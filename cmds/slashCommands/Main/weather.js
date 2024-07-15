const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { emojis } = require('../../../config.js');
const weather = require('../../../func/weather.js');
const dayNames = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

module.exports = {
	category: 'utility',
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

		const r = await weather.current(process.env.WEATHER, city);
		if (r === 'error') return interaction.editReply(`${emojis.error} | Неизвестная ошибка`)
		if (r.error) {
			if (r.error.code == 1006) return interaction.editReply(`${emojis.error} | Город не найден!`);
			interaction.editReply(`${emojis.error} | Ошибка получения данных: \`${r.error.message}\``);
		}
		const embed = new EmbedBuilder()
			.setTitle(r.location.name + ", " + r.location.country)
			.setDescription(`${emojis.arrow} ${r.current.condition.text}`)
			.addFields(
				{
					name: 'Температура',
					value: `Сейчас: **${r.current.temp_c}°C**\nПо ощущениям: **${r.current.feelslike_c}°C**`,
					inline: true,
				},
				{
					name: 'Прочее',
					value: `Влажность: **${r.current.humidity}%**\nВетер: **${(r.current.wind_kph / 3.6).toFixed(1)} м/с**\nДавление: **${r.current.pressure_mb} мм рт. ст.**`,
					inline: false,
				},
			)
			.setThumbnail("https:" + r.current.condition.icon)
			.setColor(guild.colors.basic)
			.setFooter({
				text: 'Сервис: WeatherApi 💖',
			});

		const threedaysweather = new ButtonBuilder()
			.setCustomId('threedaysweather')
			.setLabel('Погода на 3 дня')
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(threedaysweather);

		const response = await interaction.editReply({ embeds: [embed], components: [row] });
		const collectorFilter = i => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

			if (confirmation.customId === 'threedaysweather') {
				const wea = await weather.forecast(process.env.WEATHER, city, 5);
				day2 = dayNames[new Date(wea[2].date_epoch*1000).getDay()]
				const fdw = new EmbedBuilder()
			.setTitle(r.location.name + ", " + r.location.country)
			.addFields(
				{
					name: 'Сегодня',
					value: `>>> ${wea[0].day.condition.text}\n**${wea[0].day.maxtemp_c}°C** / **${wea[0].day.mintemp_c}°C**`,
					inline: true,
				},
				{
					name: 'Завтра',
					value: `>>> ${wea[1].day.condition.text}\n**${wea[1].day.maxtemp_c}°C** / **${wea[1].day.mintemp_c}°C**`,
					inline: true,
				},
				{
					name: `${day2}`,
					value: `>>> ${wea[2].day.condition.text}\n**${wea[2].day.maxtemp_c}°C** / **${wea[2].day.mintemp_c}°C**`,
					inline: false,
				},
			)
			.setThumbnail("https:" + r.current.condition.icon)
			.setColor(guild.colors.basic)
			.setFooter({
				text: 'Сервис: WeatherApi 💖',
			});
				await interaction.editReply({ embeds: [fdw], components: [] });
			}
		}
		catch (e) {
			if (e.message.includes('messageDelete')) return;
			await interaction.editReply({ embeds: [embed], components: [] });
		}
	},
};
