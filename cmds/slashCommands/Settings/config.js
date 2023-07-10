const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const Guild = require('../../../database/guild.js');
const EmbedFunc = require('../../../func/config/embeds.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Конфигурация сервера')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction, guild) {
        let embed = EmbedFunc.general(guild)
        const weather_degrees = new ButtonBuilder()
			.setCustomId('wea_deg')
			.setLabel('Градусы')
			.setStyle(ButtonStyle.Secondary);
      const embed_color = new ButtonBuilder()
			.setCustomId('emb_col')
			.setLabel('Embed цвет')
			.setStyle(ButtonStyle.Secondary);
      const row = new ActionRowBuilder()
			.addComponents(weather_degrees, embed_color);
        const response =  await interaction.reply({ embeds: [embed], components: [row] });
            const collectorFilter = i => i.user.id === interaction.user.id;
            const collectorFilter2 = response => {
              return interaction.user.id === response.author.id;
            };
try {
	const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

  if (confirmation.customId === 'wea_deg') {
		await confirmation.update({ content: 'Введите `C` или `F`', embeds: [], components: [] })
    .then(() => {
      interaction.channel.awaitMessages({ filter: collectorFilter2, max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
          if(collected.first().content == 'C' || collected.first().content == 'F') {
            guild.settings.other.weather.degree = collected.first().content;
            guild.save()
            interaction.followUp(`Теперь погода отображается в градусах \`${collected.first().content}\``)
            return;
          }
          interaction.followUp(`Доступны лишь градусы Цельсия (\`C\`) и градусы Фаренгейта (\`F\`)`);
        })
        .catch(collected => {
          interaction.followUp('Время ожидания истекло...');
        });
    });
	} else if (confirmation.customId === 'emb_col') {
		await confirmation.update({ content: 'Введите новый цвет...', embeds: [], components: [] })
    .then(() => {
      interaction.channel.awaitMessages({ filter: collectorFilter2, max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
          if(/^#[0-9A-F]{6}$/i.test(collected.first().content)) {
            guild.settings.other.color = collected.first().content;
            guild.save()
            interaction.followUp(`Для эмбеда установлен цвет \`${collected.first().content}\``)
            return;
          }
          interaction.followUp(`Цвет \`${collected.first().content}\` не найден!`);
        })
        .catch(collected => {
          interaction.followUp('Время ожидания истекло...');
        });
    });
	}

} catch (e) {
	await interaction.editReply({ embeds: [embed], components: [] });
}
    },
};