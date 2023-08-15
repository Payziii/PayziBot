const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Получить информацию о сервере"),
    async execute(interaction, guild) {
        let server = interaction.guild;
        let totalTextChannels = server.channels.cache.filter(c => c.type === ChannelType.GuildText).size + server.channels.cache.filter(c => c.type === ChannelType.GuildAnnouncement).size + server.channels.cache.filter(c => c.type === ChannelType.GuildForum).size;
        let totalVoiceChannels = server.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size + server.channels.cache.filter(c => c.type === ChannelType.GuildStageVoice).size

        let totalUsers = server.members.cache.filter(c => c.user.bot == false).size;
        let totalBots = server.members.cache.filter(c => c.user.bot == true).size;

        const embed = new EmbedBuilder()
  .setColor(guild.colors.basic)
  .setTitle(server.name)
  .setDescription(`<:arrow:1140937463209152572> Владелец: **${server.members.cache.get(server.ownerId).user.username}**\n<:arrow:1140937463209152572> Сервер создан: <t:${(server.createdTimestamp/1000).toFixed(0)}:D> (<t:${(server.createdTimestamp/1000).toFixed(0)}:R>)\n<:arrow:1140937463209152572> Бустов: **${server.premiumSubscriptionCount}**`)
  .addFields(
    {
      name: "<:member:732128945365057546> Участники",
      value: `Люди: ${totalUsers}\nБоты: ${totalBots}`,
      inline: true
    },
    {
      name: "<:channel:732125684259881052> Каналы",
      value: `Всего:  ${totalTextChannels+totalVoiceChannels}\nТекстовых: ${totalTextChannels}\nГолосовых: ${totalVoiceChannels}`,
      inline: true
    },
  )
  .setThumbnail(`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.webp`)
            .setFooter({text: `ID: ${server.id}`});
        await interaction.reply({embeds: [embed]});
    },
};
