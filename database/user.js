const mongoose = require('mongoose');

const premiumSchema = mongoose.Schema({
	status: { type: Boolean, default: false },
	guildID: { type: String, default: '-1' },
	type: { type: Number, default: 0 },
	hours: { type: Number, default: 0 },
});

const user = mongoose.Schema({
	userID: String,
	premium: { type: premiumSchema, default: null },
	games: {
		distr: { type: Number, default: 0 },
		game: { type: Number, default: 0 },
		city: { type: Number, default: 0 },
		logo: { type: Number, default: 0 }
	}
});

module.exports = mongoose.model('User', user);