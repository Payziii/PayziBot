const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { emojis } = require('../../../config.js');

module.exports = {
	category: 'mod',
	cooldown: 3,
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription('Управление каналами')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addSubcommand(subcommand =>
			subcommand
				.setName('lock')
				.setDescription('Закрыть этот канал для @everyone'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('unlock')
				.setDescription('Открыть этот  канал для @everyone')),
	async execute(interaction) {
		await interaction.deferReply();
		const bot = await interaction.guild.members.me;
		if (bot.permissions.has('ManageChannels') == false) return interaction.editReply(`${emojis.error} | У меня нет прав для управления каналами`);
		if (interaction.options.getSubcommand() === 'lock') {
			interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
				SendMessages: false,
				ViewChannel: false,
				ReadMessageHistory: false,
			}).then(() => {
				interaction.followUp(`${emojis.success} Канал <#${interaction.channel.id}> закрыт по просьбе <@${interaction.user.id}> (${interaction.user.username})`);
			}).catch(e => {
				interaction.followUp(`${emojis.error} | Ошибка: ${e}`);
			});
		}
		else if (interaction.options.getSubcommand() === 'unlock') {
			interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
				SendMessages: true,
				ViewChannel: true,
				ReadMessageHistory: true,
			}).then(() => {
				interaction.followUp(`${emojis.success} Канал <#${interaction.channel.id}> открыт по просьбе <@${interaction.user.id}> (${interaction.user.username})`);
			}).catch(e => {
				interaction.followUp(`${emojis.error} | Ошибка: ${e}`);
			});
		}
	},
};
