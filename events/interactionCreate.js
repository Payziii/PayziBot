const { Events } = require('discord.js');
const Guild = require('../database/guild.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        // DB
    let guild = await Guild.findOne({ guildID: interaction.guild.id });

    if (!guild) {
		await Guild.create({ guildID: interaction.guild.id });
		client.channels.cache
			.get('1124261194325299271')
			.send(
				`:white_check_mark: | Сервер ${interaction.guild.name}(${
					interaction.guild.id
				}) успешно был добавлен в БД`
			);
	}
    guild = await Guild.findOne({ guildID: interaction.guild.id });

    if (!guild) return interaction.reply("<:no:1107254682100957224> | Напиши команду еще раз!")
    // DB
    if (interaction.channel === null) return interaction.reply("<:no:1107254682100957224> | Я доступен только на серверах!");
    const cmd = interaction.client.commands.get(interaction.commandName);
    try {
        await cmd.execute(interaction, guild);
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