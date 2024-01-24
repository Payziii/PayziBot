const User = require('../../database/user.js');
const { CheckAch } = require('./giveAch.js');

async function CorrectGame(id) {
	const user = await User.findOne({ userID: id });
	if (!user) return;
	user.games.game++;
	user.save();
}

async function CorrectCity(id, channel) {
	const user = await User.findOne({ userID: id });
	if (!user) return;
	if(user.games.city >= 49) {
		CheckAch(1, id, channel)
	}
	user.games.city++;
	user.save();
}

async function CorrectLogo(id) {
	const user = await User.findOne({ userID: id });
	if (!user) return;
	user.games.logo++;
	user.save();
}

async function CorrectFlag(id) {
	const user = await User.findOne({ userID: id });
	if (!user) return;
	user.games.flag++;
	user.save();
}

async function CorrectCountry(id) {
	const user = await User.findOne({ userID: id });
	if (!user) return;
	if(user.games.city >= 110) {
		CheckAch(10, id, channel)
	}
	user.games.country++;
	user.save();
}

module.exports = {
	CorrectGame,
	CorrectCity,
	CorrectLogo,
	CorrectFlag,
	CorrectCountry,
};