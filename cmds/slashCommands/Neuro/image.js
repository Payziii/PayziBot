const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const tr = require('googletrans').default;
const config = require('../../../config.js');

module.exports = {
    cooldown: 60,
    data: new SlashCommandBuilder()
        .setName('image')
        .setDescription('Генерация изображения')
        .addStringOption((option) =>
            option.setName('запрос')
            .setDescription('Опишите картинку, которую хотите получить')
            .setMaxLength(64)
            .setRequired(true) 
        ),
    async execute(interaction, guild, user, openai) {
        await interaction.deferReply();
        text = interaction.options.getString('запрос')
        
        try {
        const image = await openai.createImage({
			prompt: text
		})
    } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }

        const embed = new EmbedBuilder()
  .setTitle("Генерация изображений")
  .setDescription(`Запрос: \`\`\`${text}\`\`\``)
  .setImage(image.data.data[0].url)
  .setColor(guild.settings.other.color);

await interaction.editReply({ embeds: [embed] });
    },
};
