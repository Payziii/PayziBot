const mongoose = require('mongoose');

const premiumSchema = mongoose.Schema({
    status: {type: Boolean, default: false},
    userID: {type: String, default: '-1'},
    endDate: {type: Number, default: 0},
    startDate: {type: Number, default: 0}
})

const guild = mongoose.Schema({
  guildID: String,
  settings: {
    music: {
        autoLeaveEnd: { type: Number, default: 180 },
        autoLeaveEmpty: { type: Number, default: 180 },
        volume: { type: Number, default: 100 }
    },
    other: {
        weather: {
            degree: {type: String, default: 'C'},
        },
        color: {type: String, default: '#255520'}
    },
    starboard: {
      channelID: {type: String, default: '-1'},
      reqReacts: { type: Number, default: 1 },
      data: {type: Map, default: []}
    }
  },
  premium: {type: premiumSchema, default: null}
})

module.exports = mongoose.model("Guild", guild)