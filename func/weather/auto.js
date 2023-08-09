const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Gismeteo } = require('gismeteo');
const gismeteo = new Gismeteo();

async function getWeather(city) {
    gismeteo.getNow(city).then((cur) => {
        const embed = new EmbedBuilder()
.setTitle(city)
.setDescription(`${cur.summary}`)
.addFields(
{
  name: "Температура",
  value: `Сейчас: **${cur.temp}°C**\nПо ощущениям: **${cur.temp_feels}°C**`,
  inline: true
},
{
  name: "Геомагнитное поле",
  value: `**${cur.geomagnetic}**`.replace(1, 'Нет заметных возмущений').replace(2, 'Небольшие возмущения').replace(3, 'Слабая геомагнитная буря').replace(4, 'Малая геомагнитная буря').replace(5, 'Умеренная геомагнитная буря').replace(6, 'Сильная геомагнитная буря').replace(7, 'Жесткий геомагнитный шторм').replace(8, 'Экстремальный шторм'),
  inline: true
},
{
  name: "Прочее",
  value: `Влажность: **${cur.humidity}%**\nВетер: **${cur.wind_speed} м/с (${cur.wind_dir})**\nДавление: **${cur.pressure} мм рт. ст.**`,
  inline: false
},
)
.setThumbnail(cur.image)
.setColor(guild.colors.basic)
.setFooter({
text: "Сервис: Gismeteo",
});

return embed;
}).catch(e => {
    return false;
  })
}

module.exports = {
    getWeather
}