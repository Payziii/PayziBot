const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const weather = require("weather-js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Узнать погоду')
        .addStringOption((option) =>
            option
                .setName('город')
                .setDescription('Город, погоду в котором надо узнать')
                .setRequired(true)
        ),
    async execute(interaction, guild) {
        let city = interaction.options.getString('город');
        await interaction.deferReply();
        let degrees = guild.settings.other.weather.degree;
        weather.find({search: city, degreeType: degrees, lang: "ru-ru"}, function (err, result) {
            if(err) return interaction.reply(`⚠ Ошибка: ${err}`);
            if(result === undefined || result.length === 0) {
            interaction.reply(`<:no:1107254682100957224> | Такого города не найдено`);
            return
            }
            let cur = result[0].current;
            const embed = new EmbedBuilder()
  .setTitle(cur.observationpoint)
  .setDescription(`${cur.skytext}`)
  .addFields(
    {
      name: "Температура",
      value: `Сейчас: **${cur.temperature}°${degrees}**\nПо ощущениям: **${cur.feelslike}°${degrees}**`,
      inline: true
    },
    {
      name: "Прочее",
      value: `Влажность: **${cur.humidity}%**\nСкорость ветра: **${cur.windspeed}**`,
      inline: true
    },
  )
  .setThumbnail(cur.imageUrl)
  .setColor(guild.settings.other.color)
  .setFooter({
    text: "Сервис: Microsoft",
  });

interaction.editReply({ embeds: [embed] });
        })
    },
};
