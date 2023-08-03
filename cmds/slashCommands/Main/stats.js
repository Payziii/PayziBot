const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const os = require('os')
const time = require('payzi-time');
const config = require('../../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Информация о боте'),
    async execute(interaction, guild) {
      await interaction.deferReply();
        client = interaction.client;
        const uptime = time(client.uptime)
        let bremya;
        if (uptime.minutes === 0 && uptime.hours === 0 && uptime.days === 0) bremya = `${uptime.seconds} сек.`
        else if (uptime.hours === 0 && uptime.days === 0) bremya = `${uptime.minutes} м. ${uptime.seconds} сек.`
        else if (uptime.days === 0) bremya = `${uptime.hours} ч. ${uptime.minutes} м.`
        else bremya = `${uptime.days} д. ${uptime.hours} ч. ${uptime.minutes} м.`
        const embed = new EmbedBuilder()
  .setTitle(`PayziBot ${config.version}`)
  .setDescription(`<:arrow:1107256361219268718> Бот работает: **${bremya}**`)
  .addFields(
    {
      name: "Статистика",
      value: `Серверов: **${client.guilds.cache.size}**\nКаналов: **${client.channels.cache.size}**`,
    },
    {
      name: "Хостинг",
      value: `ОЗУ: \`${(process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(0)} МБ\`/\`${(os.totalmem()/ (1024 * 1024)).toFixed(0)} МБ\`\nWebSocket: \`${client.ws.ping}ms\`\nЦП: \`${os.cpus()[0].model}\``,
    },
  )
  .setThumbnail("https://cdn.discordapp.com/avatars/732867965053042690/f3f976adc4cb628dd707a8f4203e1f5d.webp?size=4096")
        .setColor(guild.settings.colors.basic)
        const links = new EmbedBuilder()
        .setTitle("Ссылки")
        .setDescription(`<:arrow:1107256361219268718> [Сервер поддержки](https://discord.gg/E7SFuVEB2Z)\n
        <:arrow:1107256361219268718> [Добавить бота](https://discord.com/api/oauth2/authorize?client_id=576442351426207744&permissions=1376939797574&scope=bot)\n
        <:arrow:1107256361219268718> [Документация](https://payzibot.fiftygames.ru/)\n\n
        <:arrow:1107256361219268718> [PayziBot на BotiCord](https://boticord.top/bot/576442351426207744)`)
        .setThumbnail("https://cdn.discordapp.com/avatars/732867965053042690/f3f976adc4cb628dd707a8f4203e1f5d.webp?size=4096")
        .setColor(guild.settings.colors.basic);
        const link_button = new ButtonBuilder()
			.setCustomId('link_button')
			.setLabel('Ссылки')
			.setStyle(ButtonStyle.Secondary);
      const row = new ActionRowBuilder()
			.addComponents(link_button);

      const response =  await interaction.editReply({ embeds: [embed], components: [row] });
            const collectorFilter = i => i.user.id === interaction.user.id;
try {
	const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

  await interaction.editReply({ embeds: [links], components: []});

} catch (e) {
	await interaction.editReply({ embeds: [embed], components: [] });
}
    },
};
