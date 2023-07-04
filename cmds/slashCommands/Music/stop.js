const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Остановить воспроизведение музыки'),
    async execute(interaction, guild, player) {
        await interaction.deferReply();

    const queue = player.nodes.cache.get(interaction.guildId);
    if(!interaction.guild.members.me.voice.channel || queue.node.isPlaying === false) return interaction.reply('<:none:1107254345839415396> | Но бот же сейчас ничего не играет :/')
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('<:no:1107254682100957224> | Вы не подключены к голосовому каналу!');
    if(channel.id != interaction.guild.members.me.voice.channel.id) return interaction.reply('<:no:1107254682100957224> | Вы подключены к другому голосовому каналу!');

    queue.node.stop();

    return void interaction.followUp('<:yes:1107254746336735312> | Музыка остановлена');
    },
};
