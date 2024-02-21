const { Events, Collection } = require('discord.js');
const Guild = require('../database/guild.js');
const User = require('../database/user.js');
const { channels } = require('../config.js');
const { emojis } = require('../config.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {

		if (!interaction.isChatInputCommand()) return;
		if (interaction.channel === null) return interaction.reply(`${emojis.error} | Слэш-команды доступны только на серверах!`);

		// Получаем пользователя и сервер из базы данных
		let guild = await Guild.findOne({ guildID: interaction.guild.id });
		let user = await User.findOne({ userID: interaction.user.id });

		// Если сервера нет, создаем
		if (!guild) {
			await Guild.create({ guildID: interaction.guild.id }).then(async () => {
				client.channels.cache
					.get(channels.dbLogs)
					.send(
						`${emojis.announcement} | Сервер ${interaction.guild.name}(${interaction.guild.id
						}) успешно был добавлен в MongoDB`,
					);
				guild = await Guild.findOne({ guildID: interaction.guild.id });
			});
		}

		// Также и с юзером
		if (!user) {
			await User.create({ userID: interaction.user.id }).then(async () => {
				client.channels.cache
					.get(channels.dbLogs)
					.send(
						`${emojis.members} | Пользователь ${interaction.user.username}(${interaction.user.id
						}) успешно был добавлен в MongoDB. Первая команда \`${interaction.commandName}\``,
					);
				user = await User.findOne({ userID: interaction.user.id });
			});
		}

		if (!guild) return interaction.reply(`${emojis.error} | Напиши команду ещё раз!`);
		if (!user) return interaction.reply(`${emojis.error} | Напиши команду ещё раз!`);

		if(user.block >= 4) return; // Доступ запрещён

		const cmd = interaction.client.commands.get(interaction.commandName); // Ищем команду
		if (!cmd) return interaction.reply(`${emojis.error} | Команда не найдена. Как такое могло произойти?`);

		// Задержки
		const { cooldowns } = client;
		if (!cooldowns.has(cmd.data.name)) {
			cooldowns.set(cmd.data.name, new Collection());
		}
		const now = Date.now();
		let coef = 1;
		if(user.block >= 3) coef = 2;
		const timestamps = cooldowns.get(cmd.data.name);
		const cooldownAmount = (cmd.cooldown ?? 1) * 1000*coef;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime && !user.bypassDelay) {
				const expiredTimestamp = Math.round(expirationTime / 1000);
				return interaction.reply({
					content: `${emojis.timeout} | Сейчас вы не можете использовать команду \`${cmd.data.name}\`. Попробуйте снова <t:${expiredTimestamp}:R>.`,
					ephemeral: true,
				});
			}
		}
		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
		try {
			await cmd.execute(interaction, guild, user); // Выполняем команду
			client.cmdsUsed++;
		}
		catch (error) {
			if (interaction.deferred === false) {
				interaction.reply(`${emojis.error} | Произошла ошибка!\n\`\`\`bash\n${error}\`\`\``);
			}
			else {
				interaction.editReply(`${emojis.error} | Произошла ошибка!\n\`\`\`bash\n${error}\`\`\``);
			}
			console.log(error);
		}
	},
};