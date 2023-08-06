const { Schema, model } = require('mongoose');

const premiumSchema = Schema({
    status: {type: Boolean, default: false},
    userID: {type: String, default: '-1'},
    endDate: {type: Number, default: 0},
    startDate: {type: Number, default: 0}
})

const guild = Schema({
  guildID: String,
  settings: {
    colors: {
      basic: {type: String, default: '#255520'},
      error: {type: String, default: '#ff033e'},
      correct: {type: String, default: '#008000'}
    },
    starboard: {
      channelID: {type: String, default: '-1'},
      reqReacts: { type: Number, default: 1 },
      customReact: {type: String, default: '⭐'},
      data: {type: Map, default: []}
    },
    neuro: {
      chatgpt: {type: Boolean, default: false}
    }
  },
  premium: {type: premiumSchema, default: null}
})

module.exports = model("Guild", guild)