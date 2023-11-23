const User = require('../../database/user.js');

async function CorrectGame(id) {
	const user = await User.findOne({ userID: id });
	if (!user) return;
	user.games.game++;
	user.save();
}

async function CorrectCity(id) {
	const user = await User.findOne({ userID: id });
	if (!user) return;
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

module.exports = {
	CorrectGame,
	CorrectCity,
	CorrectLogo,
	CorrectFlag,
};