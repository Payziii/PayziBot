const { Schema, model } = require('mongoose');

const guild = Schema({
	guildID: String,
	colors: {
		basic: { type: String, default: '#3fcc65' },
		error: { type: String, default: '#ff033e' },
		correct: { type: String, default: '#008000' },
		starboard: { type: String, default: '#cfc50d' },
		giveaway: { type: String, default: '#9327e1' },
	},
	starboard: {
		channelID: { type: String, default: '-1' },
		reqReacts: { type: Number, default: 1 },
		customReact: { type: String, default: '⭐' },
		data: { type: Map, default: [] },
	},
	neuro: {
		chatgpt: { type: Boolean, default: false },
		auto: { type: Boolean, default: false },
		channels: { type: Array, default: [] }
	},
	welcome: {
		channelID: { type: String, default: '-1' },
		welcomeText: { type: String, default: 'Привет, {user.mention}. Добро пожаловать на {guild.name}' },
		autoRoleID: { type: String, default: '-1' },
	},
	leave: {
		channelID: { type: String, default: '-1' },
		leaveText: { type: String, default: 'О нет, {user.name} покинул нас!' },
	},
	premium: {
		status: { type: Boolean, default: false },
		userID: { type: String, default: '-1' },
		endDate: { type: Number, default: 0 },
		startDate: { type: Number, default: 0 },
	},
	autoreact: {
		channelID: { type: String, default: '-1' },
		reacts: { type: Array, default: [] },
	},
	mediaRate: {
		channelID: { type: String, default: '-1' },
		pinRate: { type: Number, default: 5 },
		data: { type: Map, default: [] },
	},
	rr: { type: Map, default: [] },
	customCommands: { type: Map, default: [] },
});

module.exports = model('Guild', guild);