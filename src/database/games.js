const { Schema, model } = require('mongoose');

const games = new Schema({
	name: String,
	id: Number,
	all: { type: Number, default: 0 },
	correct: { type: Number, default: 0 },
});

module.exports = model('Games', games);