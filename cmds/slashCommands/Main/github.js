const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Посмотреть пользователя на GitHub')
        .addStringOption((option) =>
            option
                .setName('ник')
                .setDescription('Ник пользователя на GitHub.')
                .setRequired(true)
                .setMaxLength(30)
        ),
    async execute(interaction, guild) {
        await interaction.deferReply();
        let query = interaction.options.getString('ник');

        let msg;
        let bio = 'Отсутствует';
        let name = 'Отсутствует';
        let login;
        let repos;
        let html_url;
        let id;
        let avatar;
        let fl;
        
        await require('node-fetch')(`https://api.github.com/users/${query}`).then(r => r.json()).then(r => {
    if(r.message && r.message == 'Not Found') return msg = true;
        if(r.bio) bio = r.bio;
        if(r.name) name = r.name;
        login = r.login;
        repos = r.public_repos
        fl = r.followers;
        html_url = r.html_url;
        id = r.id;
        avatar = r.avatar_url;
})
if(msg) return interaction.editReply(`<:no:1107254682100957224> | Ничего не найдено!`);
const embed = new EmbedBuilder()
        .setTitle(`Пользователь ${login}`)
        .setURL(html_url)
        .setDescription(`<:arrow:1140937463209152572> Публичных репозиториев: **${repos}**\n<:arrow:1140937463209152572> Подписчиков: **${fl}**\n<:arrow:1140937463209152572> Имя: **${name}**\n<:arrow:1140937463209152572> Биография: **${bio}**`)
        .setThumbnail(avatar)
        .setColor(guild.colors.basic)
        .setFooter({
            text: `ID: ${id}`,
          });
          const repos_button = new ButtonBuilder()
			.setCustomId('repos_button')
			.setLabel('Репозитории пользователя')
			.setStyle(ButtonStyle.Secondary);
      const row = new ActionRowBuilder()
			.addComponents(repos_button);

            const response =  await interaction.editReply({ embeds: [embed], components: [row] });
            const collectorFilter = i => i.user.id === interaction.user.id;
try {
	const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
     let desc;
    await require('node-fetch')(`https://api.github.com/users/${query}/repos`).then(r => r.json()).then(r => {
        if(r.length > 30) r = r.slice(0, 30);
        desc = "**" + r.map(rp => rp.name).join('**, **') + "**";
        if(desc == "****") desc = "**Отсутствуют**"
})
const reps = new EmbedBuilder()
  .setTitle(`Пользователь ${login}`)
  .setURL(html_url)
  .setDescription("Репозитории: " + desc)
  .setThumbnail(avatar)
  .setColor(guild.colors.basic)
  .setFooter({
    text: `ID: ${id}`,
  });
  await interaction.editReply({ embeds: [reps], components: []});

} catch (e) {
	await interaction.editReply({ embeds: [embed], components: [] });
}
    },
};
