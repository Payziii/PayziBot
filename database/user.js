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
});

module.exports = mongoose.model('User', user);