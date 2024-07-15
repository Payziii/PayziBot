/* eslint-disable no-unused-vars */
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { emojis } = require('../../../config.js');
const plural = require('../../../func/plural.js');

module.exports = {
	category: 'utility',
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('github')
		.setDescription('Посмотреть пользователя на GitHub')
		.addStringOption((option) =>
			option
				.setName('ник')
				.setDescription('Ник пользователя на GitHub.')
				.setRequired(true)
				.setMaxLength(39),
		),
	async execute(interaction, guild) {
		await interaction.deferReply();
		const query = interaction.options.getString('ник');

		let bio = 'Отсутствует', name = 'Отсутствует', blog = 'Отсутствует';
		let login, repos, html_url, id, avatar, fl, msg;

		await require('node-fetch')(`https://api.github.com/users/${query}`).then(r => r.json()).then(r => {
			if (r.message && r.message == 'Not Found') return msg = true;
			if (r.bio) bio = r.bio;
			if (r.name) name = r.name;
			if (r.blog) {
				if(r.blog.startsWith('http') == false) blog = `[Нажмите сюда](https://${r.blog})`;
				else blog = `[Нажмите сюда](${r.blog})`;
		}
			login = r.login;
			repos = r.public_repos;
			fl = r.followers;
			html_url = r.html_url;
			id = r.id;
			avatar = r.avatar_url;
		});
		if (msg) return interaction.editReply(`${emojis.error} | Ничего не найдено!`);
		const embed = new EmbedBuilder()
			.setTitle(`Пользователь ${login}`)
			.setURL(html_url)
			.setDescription(`${emojis.arrow} Публичных репозиториев: **${repos}**\n${emojis.arrow} Подписчиков: **${fl}**\n${emojis.arrow} Имя: **${name}**\n${emojis.arrow} Биография: **${bio}**\n${emojis.arrow} Сайт: **${blog}**`)
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

		const response = await interaction.editReply({ embeds: [embed], components: [row] });
		const collectorFilter = i => i.user.id === interaction.user.id;
		try {
			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
			let desc='';
			await require('node-fetch')(`https://api.github.com/users/${query}/repos`).then(r => r.json()).then(r => {
				desc;
				if(r.length>10) { length = 10 } else { length = r.length }
				for(i=0; i< length; i++) {
					if(i!=0) desc = desc+'\n'
					desc = desc+`${i+1}. ${r[i].name}: ${r[i].stargazers_count} ${emojis.github_star} | ${r[i].forks_count} ${emojis.github_fork}`
				}
				// if (r.length > 30) r = r.slice(0, 30);
				// desc = '**' + r.map(rp => rp.name).join('**, **') + '**';
				// if (desc == '****') desc = '**Отсутствуют**';
			});
			const reps = new EmbedBuilder()
				.setTitle(`Репозитории ${login}`)
				.setURL(html_url)
				.setDescription(desc || "**Репозитории отсутствуют**")
				.setThumbnail(avatar)
				.setColor(guild.colors.basic);
			await interaction.editReply({ embeds: [reps], components: [] });

		}
		catch (e) {
			await interaction.editReply({ embeds: [embed], components: [] });
		}
	},
};
