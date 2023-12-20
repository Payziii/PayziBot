const User = require('../../database/user.js');
const ach_list = require('../../games_scr/profile/achievements.json');
const { EmbedBuilder } = require('discord.js');

async function CheckAch(ach, id, channel) {
	const user = await User.findOne({ userID: id });
	if (!user) return;
	if(user.ach.includes(ach)) return;
	user.ach.push(ach);
	user.save();
	SendMess(ach, id, channel);
}

async function SendMess(ach, id, channel) {
	try {
	const embed = new EmbedBuilder()
  .setTitle("Новое достижение!")
  .setDescription(`Получено достижение: **${ach_list[ach].name}** (${ach_list[ach].description})`)
  .setColor("#7029f5")
  .setFooter({
    text: "С наступающим новым годом!",
  });

await channel.send({ content: `<@${id}>`, embeds: [embed] });
	}
	catch(err) {
		console.log(err)
	}
}

module.exports = {
	CheckAch,
	SendMess
};