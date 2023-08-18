const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.GuildDelete,
	async execute(guild, client) {
        const embed = new EmbedBuilder()
  .setTitle("Сервер удалён")
  .setDescription(`Название: **${guild.name}**\nУчастников: **${guild.memberCount}**\n\nСервер создан: <t:${(guild.createdTimestamp/1000).toFixed(0)}:D> (<t:${(guild.createdTimestamp/1000).toFixed(0)}:R>)`)
  .setColor("#ff033e")
  .setFooter({
    text: `ID: ${guild.id}`,
  });

  client.channels.cache.get('1137366763177267261')
              .send({embeds: [embed]})
    }
};