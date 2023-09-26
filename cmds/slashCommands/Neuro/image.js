const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { inspect } = require('util')

module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Генерация изображения')
        .addStringOption((option) =>
            option.setName('запрос')
            .setDescription('Опишите картинку, которую хотите получить')
            .setMaxLength(256)
            .setRequired(true) 
        ),
    async execute(interaction, guild, user, openai) {
        await interaction.deferReply();
        text = interaction.options.getString('запрос')
        
        try {
        const image = await openai.createImage({
			prompt: text
		})
        const embed = new EmbedBuilder()
  .setTitle("Генерация изображений")
  .setDescription(`Запрос: \`\`\`${text}\`\`\``)
  .setImage(image.data.data[0].url)
  .setColor(guild.colors.basic);

await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
          interaction.client.channels.cache.get('1115145596429406280').send(`Ошибка в image (${error.response.status}): \`\`\`${inspect(error.response.data).slice(0, 1900)}\`\`\``)
          interaction.editReply(`<:no:1107254682100957224> | Произошла неизвестная ошибка (Код: ${error.response.status}). Она была отправлена администрации бота!`)
        } else {
          console.log(error.message);
          interaction.editReply(`<:no:1107254682100957224> | Ошибка: \`\`\`${error.message}\`\`\``)
        }
      }
    },
};
