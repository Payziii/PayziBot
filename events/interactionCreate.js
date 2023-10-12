const { Events, Collection } = require('discord.js');
const Guild = require('../database/guild.js');
const User = require('../database/user.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client, openai) {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.channel === null) return interaction.reply("<:no:1107254682100957224> | Я доступен только на серверах!");
        // DB
    let guild = await Guild.findOne({ guildID: interaction.guild.id });
    let user = await User.findOne({ userID: interaction.user.id });

    if (!guild) {
		await Guild.create({ guildID: interaction.guild.id }).then(() => {
		client.channels.cache
			.get('1124261194325299271')
			.send(
				`<:announcement:732128155195801641> | Сервер ${interaction.guild.name}(${
					interaction.guild.id
				}) успешно был добавлен в MongoDB используя I`
			);
        })
	}

    if(!user) {
		await User.create({ userID: interaction.user.id }).then(() => {
			client.channels.cache
			.get('1124261194325299271')
			.send(
				`<:member:732128945365057546> | Пользователь ${interaction.user.username}(${
					interaction.user.id
				}) успешно был добавлен в MongoDB используя I`
			);
		})
	}

    guild = await Guild.findOne({ guildID: interaction.guild.id });
    user = await User.findOne({ userID: interaction.user.id });

    if (!guild) return interaction.reply("<:no:1107254682100957224> | Напиши команду ещё раз! Ошибка `NoG-I`")
    if (!user) return interaction.reply("<:no:1107254682100957224> | Напиши команду ещё раз! Ошибка `NoU-I`")
    // DB
    const { cooldowns } = client
    const cmd = interaction.client.commands.get(interaction.commandName);
    if(!cmd) return interaction.reply(`<:no:1107254682100957224> | Команда не найдена. Как такое могло произойти?`)
    if (!cooldowns.has(cmd.data.name)) {
        cooldowns.set(cmd.data.name, new Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(cmd.data.name);
    const cooldownAmount = (cmd.cooldown ?? 1) * 1000;

if (timestamps.has(interaction.user.id)) {
	const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

	if (now < expirationTime) {
		const expiredTimestamp = Math.round(expirationTime / 1000);
		return interaction.reply({
            content: `<:timeout_clock:1134453176091824250> | Сейчас вы не можете использовать команду \`${cmd.data.name}\`. Попробуйте снова <t:${expiredTimestamp}:R>.`,
            ephemeral: true 
        });
	}
}
timestamps.set(interaction.user.id, now);
setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
    try {
        await cmd.execute(interaction, guild, user, openai);
    } catch (error) {
        if(interaction.deferred === false){
            interaction.reply(`<:no:1107254682100957224> | Произошла ошибка!\n\`\`\`bash\n${error}\`\`\``);
        }else{
            interaction.editReply(`<:no:1107254682100957224> | Произошла ошибка!\n\`\`\`bash\n${error}\`\`\``);
        }
        console.log(error);
    }
	},
};