const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Аватар пользователя')
        .addUserOption((option) =>
            option
                .setName('пользователь')
                .setDescription('Пользователь, чей аватар вы хотите увидеть.')
                .setRequired(false)
        ),
    async execute(interaction, guild) {
        await interaction.deferReply();
        let user = interaction.options.getUser('пользователь');
        if (user == null) {
            user = interaction.user;
        }
        const url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=4096`;
        const png = new ButtonBuilder()
	.setLabel('PNG')
	.setURL(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`)
	.setStyle(ButtonStyle.Link);
    const jpeg = new ButtonBuilder()
	.setLabel('JPEG')
	.setURL(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg?size=4096`)
	.setStyle(ButtonStyle.Link);
    const webp = new ButtonBuilder()
	.setLabel('WEBP')
	.setURL(url)
	.setStyle(ButtonStyle.Link);
    const row = new ActionRowBuilder()
			.addComponents(png, jpeg, webp);
            const embed = new EmbedBuilder()
                .setTitle(`${user.username}`)
                .setColor(guild.colors.basic)
                .setImage(url);
            await interaction.editReply({ embeds: [embed], components: [row] });
    },
};
