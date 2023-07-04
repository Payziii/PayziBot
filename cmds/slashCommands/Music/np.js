const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Посмотреть, что сейчас играет'),
    async execute(interaction, guild, player) {
        await interaction.deferReply();

    const queue = player.nodes.cache.get(interaction.guildId);
    if(!interaction.guild.members.me.voice.channel || queue.node.isPlaying === false) return interaction.reply('<:none:1107254345839415396> | Сейчас ничего не играет')

    const embed = new EmbedBuilder()
  .setTitle("Сейчас играет...")
  .setURL(queue.currentTrack.url)
  .setDescription(`Название: **${queue.currentTrack.title}**\n\n**${queue.node.createProgressBar()}**`)
  .setThumbnail(queue.currentTrack.thumbnail)
  .setColor(guild.settings.other.color);

    return void interaction.followUp({
      embeds: [embed],
    });
    },
};
