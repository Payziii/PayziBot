const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const { emojis } = require('../../../config.js');

module.exports = {
	category: 'utility',
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Получить информацию о сервере'),
	async execute(interaction, guild) {
		const server = interaction.guild;
		const totalTextChannels = server.channels.cache.filter(c => c.type === ChannelType.GuildText).size + server.channels.cache.filter(c => c.type === ChannelType.GuildAnnouncement).size + server.channels.cache.filter(c => c.type === ChannelType.GuildForum).size;
		const totalVoiceChannels = server.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size + server.channels.cache.filter(c => c.type === ChannelType.GuildStageVoice).size;

		const totalUsers = server.members.cache.filter(c => c.user.bot == false).size;
		const totalBots = server.members.cache.filter(c => c.user.bot == true).size;

		const embed = new EmbedBuilder()
			.setColor(guild.colors.basic)
			.setTitle(server.name)
			.setDescription(`${emojis.arrow} Владелец: **${server.members.cache.get(server.ownerId).user.username}**\n${emojis.arrow} Сервер создан: <t:${(server.createdTimestamp / 1000).toFixed(0)}:D> (<t:${(server.createdTimestamp / 1000).toFixed(0)}:R>)\n${emojis.arrow} Бустов: **${server.premiumSubscriptionCount}**`)
			.addFields(
				{
					name: `${emojis.members} Участники`,
					value: `Люди: ${totalUsers}\nБоты: ${totalBots}`,
					inline: true,
				},
				{
					name: `${emojis.channels} Каналы`,
					value: `Всего:  ${totalTextChannels + totalVoiceChannels}\nТекстовых: ${totalTextChannels}\nГолосовых: ${totalVoiceChannels}`,
					inline: true,
				},
			)
			.setThumbnail(`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp`)
			.setFooter({ text: `ID: ${server.id}` });
		await interaction.reply({ embeds: [embed] });
	},
};
