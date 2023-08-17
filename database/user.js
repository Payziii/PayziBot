const { Schema, model } = require('mongoose');

const premiumSchema = Schema({
	status: { type: Boolean, default: false },
	guildID: { type: String, default: '-1' },
	type: { type: Number, default: 0 },
	hours: { type: Number, default: 0 },
});

const user = Schema({
	userID: String,
	premium: { type: premiumSchema, default: null },
	games: {
		game: { type: Number, default: 0 },
		city: { type: Number, default: 0 },
		logo: { type: Number, default: 0 },
		flag: { type: Number, default: 0 }
	}
});

module.exports = 
	model('User', user),
	model('PremiumUser', premiumSchema)
