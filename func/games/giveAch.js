const User = require('../../database/user.js');
const ach_list = require('../../games_scr/profile/achievements.json');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

async function CheckAch(ach, id, channel) {
	const user = await User.findOne({ userID: id });
	if (!user) return;
	if(user.ach.includes(ach)) return;
	user.ach.push(ach);
	user.save();
	SendMess(ach, id, channel);
}

async function SendMess(ach, id, channel) {
	const ach_link = new ButtonBuilder()
	.setLabel('Все достижения')
	.setURL('https://docs.payzibot.ru/first-steps/achievements')
	.setStyle(ButtonStyle.Link);

	const row = new ActionRowBuilder()
			.addComponents(ach_link);

	const embed = new EmbedBuilder()
  .setTitle("Новое достижение!")
  .setDescription(`Получено достижение: **${ach_list[ach].name}** (${ach_list[ach].description})`)
  .setColor("#7029f5")
  .setFooter({
    text: "С Новым Годом!",
  });

await channel.send({ content: `<@${id}>`, embeds: [embed], components: [row] });
	}

module.exports = {
	CheckAch,
	SendMess
};