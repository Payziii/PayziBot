const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildCreate,
	async execute(guild, client) {
        const embed = new EmbedBuilder()
  .setTitle("Новый сервер")
  .setDescription(`Название: **${guild.name}**\nУчастников: **${guild.memberCount}**\n\nСервер создан: <t:${(guild.createdTimestamp/1000).toFixed(0)}:D> (<t:${(guild.createdTimestamp/1000).toFixed(0)}:R>)`)
  .setColor("#3fcc65")
  .setFooter({
    text: `ID: ${guild.id}`,
  });

  client.channels.cache.get('1137366763177267261')
              .send({embeds: [embed]})
    }
};