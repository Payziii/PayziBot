const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Воспроизвести нужный трек/плейлист/видео')
        .addStringOption((option) =>
            option.setName('запрос')
            .setDescription('Ссылка на трек или его название')
            .setRequired(true)
        ),
    async execute(interaction, guild, player) {
        const channel = interaction.member.voice.channel;
    if (!channel) return interaction.reply('<:no:1107254682100957224> | Вы не подключены к голосовому каналу!'); // make sure we have a voice channel
    if(interaction.guild.channels.cache.get(channel.id).permissionsFor("576442351426207744").has("Connect") === false) return interaction.reply('<:no:1107254682100957224> | Я не имею доступа к этому каналу!');
    if(interaction.guild.members.me.voice.channel != null) {
        if(channel.id != interaction.guild.members.me.voice.channel.id) return interaction.reply('<:no:1107254682100957224> | Вы подключены к другому голосовому каналу!');
    }
    const query = interaction.options.getString('запрос', true); // we need input/query to play

    // let's defer the interaction as things can take time to process
    await interaction.deferReply();

    try {
        const { track } = await player.play(channel, query, {
            nodeOptions: {
                // nodeOptions are the options for guild node (aka your queue in simple word)
                metadata: interaction, // we can access this metadata object using queue.metadata later on
                leaveOnEndCooldown: 180000,
                leaveOnEmptyCooldown: 180000,
                volume: 100
            }
        });

        return interaction.followUp(`<:voice:732128155418099733> | Трек **${track.title}** добавлен в очередь!`);
    } catch (e) {
        // let's return error if something failed
        return interaction.followUp(`<:no:1107254682100957224> | Произошла ошибка: ${e}`);
    }
    },
};
