const { Schema, model, Mixed } = require('mongoose');

const giveaway = Schema({
	messageId: String,
	channelId: String,
	guildId: String,
	startAt: Number,
	endAt: Number,
	ended: Boolean,
	winnerCount: Number,
	prize: String,
	messages: {
		giveaway: String,
		giveawayEnded: String,
		title: String,
		inviteToParticipate: String,
		drawing: String,
		dropMessage: String,
		winMessage: Mixed,
		embedFooter: Mixed,
		noWinner: String,
		winners: String,
		endedAt: String,
		hostedBy: String
	},
	thumbnail: String,
	image: String,
	hostedBy: String,
	winnerIds: { type: [String], default: undefined },
	reaction: Mixed,
	botsCanWin: Boolean,
	embedColor: Mixed,
	embedColorEnd: Mixed,
	exemptPermissions: { type: [], default: undefined },
	exemptMembers: String,
	bonusEntries: String,
	extraData: Mixed,
	lastChance: {
		enabled: Boolean,
		content: String,
		threshold: Number,
		embedColor: Mixed
	},
	pauseOptions: {
		isPaused: Boolean,
		content: String,
		unPauseAfter: Number,
		embedColor: Mixed,
		durationAfterPause: Number,
		infiniteDurationText: String
	},
	isDrop: Boolean,
	allowedMentions: {
		parse: { type: [String], default: undefined },
		users: { type: [String], default: undefined },
		roles: { type: [String], default: undefined }
	}
},
{ id: false })

module.exports = model("Giveaway", giveaway)