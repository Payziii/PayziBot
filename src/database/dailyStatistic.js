const { Schema, model } = require('mongoose');

const dailyStat = Schema({
	date: String,
	commands: {
		all: { type: Number, default: 0 },
		detailed: { type: Map, default: [] }
	}
});

module.exports = model('DailyStat', dailyStat);