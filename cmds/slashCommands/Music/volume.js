const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Установить громкость музыки')
        .addIntegerOption((option) =>
            option.setName('громкость')
            .setDescription('Громкость 0-200%')
            .setRequired(true)
        ),
    async execute(interaction, guild, player) {
        await interaction.deferReply();

    const queue = player.nodes.cache.get(interaction.guildId);
    if(!interaction.guild.members.me.voice.channel || queue.node.isPlaying === false) return interaction.reply('<:none:1107254345839415396> | Но бот же сейчас ничего не играет :/')
    const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('<:no:1107254682100957224> | Вы не подключены к голосовому каналу!');
    if(channel.id != interaction.guild.members.me.voice.channel.id) return interaction.reply('<:no:1107254682100957224> | Вы подключены к другому голосовому каналу!');
    let volume = interaction.options.getInteger('громкость');
    if(volume < 0 || volume > 200) return interaction.followUp('<:no:1107254682100957224> | Громкость должна быть в интервале от 0 до 200%');

    queue.node.setVolume(volume);

    return void interaction.followUp(`<:yes:1107254746336735312> | Задана громкость **${volume}%**`);
    },
};
