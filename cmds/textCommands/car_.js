// ДАННАЯ ИГРА СОЗДАНА ПО ЗАКАЗУ
// И НЕ БУДЕТ ВЫПУЩЕНА В ОФИЦИАЛЬНЫЙ РЕЛИЗ PAYZIBOT
// PAYZIBOT НЕ НЕСЕТ ОТВЕТСТВЕННОСТИ ЗА МАТЕРИАЛЫ ИЗ ДАННОЙ ИГРЫ

const { EmbedBuilder } = require('discord.js');
const cars = require('../../games_src/custom/car_.json');

exports.run = async (client, message, args, guild) => {
	if(message.guild.id != '1149289750210019338') return;
	const item = cars[Math.floor(Math.random() * cars.length)];
	const image = item.image[Math.floor(Math.random() * item.image.length)];
	const collectorFilter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
	};
	const embed = new EmbedBuilder()
		.setTitle('Какое название у данного т/c?')
		.setDescription('У вас есть **30 секунд** чтобы ответить, какое транспортное средство изображено на картинке ниже')
		.setImage(image)
		.setColor(guild.colors.basic);
	message.reply({ embeds: [embed]})
		.then(() => {
			message.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
				.then(collected => {
					const embed1 = new EmbedBuilder()
						.setTitle('Какое название у данного т/c?')
						.setDescription(`Ответ: **${item.answers.join(", ")}**`)
						.setImage(image)
						.setColor(guild.colors.correct);
					message.reply({ content: `Победитель:  **${collected.first().author}**`, embeds: [embed1] });
				})
				.catch(() => {
					const embed5 = new EmbedBuilder()
						.setTitle('Какое название у данного т/c?')
						.setDescription(`Ответ: **${item.answers.join(", ")}**`)
						.setImage(image)
						.setColor(guild.colors.error);
					message.reply({ content: '**Победителей нет(**', embeds: [embed5] });
				});
		})
};
exports.help = {
	name: '!car',
	aliases: [',car'],
	description: 'Приватная команда для сервера по просьбе пользователя',
};