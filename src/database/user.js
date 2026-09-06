const { Schema, model } = require('mongoose');

const premiumSchema = Schema({
	status: { type: Boolean, default: false },
	guildID: { type: String, default: '-1' },
	type: { type: Number, default: 0 },
	hours: { type: Number, default: 0 },
});

const gameStatSchema = Schema({
	wins: { type: Number, default: 0 },
	losses: { type: Number, default: 0 },
	draws: { type: Number, default: 0 },
	played: { type: Number, default: 0 },
	bestScore: { type: Number, default: 0 },
	rating: { type: Number, default: 0 },
	lastPlayed: { type: Date, default: Date.now },
}, { _id: false });

const user = Schema({
	userID: String,
	premium: { type: premiumSchema, default: null },
	stats: {
		type: Map,
		of: gameStatSchema,
		default: {},
	},
	ach: { type: Array, default: [] },
	bio: { type: String, default: 'Вы можете написать что-нибудь о себе, используя команду `/bio`' },
	block: { type: Number, default: 0 },
	bypassDelay: { type: Boolean, default: false },
	boosts: { type: Number, default: 0 },
});

module.exports =
	model('User', user),
	model('PremiumUser', premiumSchema);
