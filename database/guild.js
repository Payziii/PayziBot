const { Schema, model } = require('mongoose');

const premiumSchema = Schema({
    status: {type: Boolean, default: false},
    userID: {type: String, default: '-1'},
    endDate: {type: Number, default: 0},
    startDate: {type: Number, default: 0}
})

const guild = Schema({
  guildID: String,
    colors: {
      basic: {type: String, default: '#3fcc65'},
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
    },
    welcome: {
      channelID: {type: String, default: '-1'},
      welcomeText: {type: String, default: 'Hello, {user.mention}. Welcome to the {guild.name}'},
      autoRoleID: {type: String, default: '-1'}
    },
    leave: {
      channelID: {type: String, default: '-1'},
      welcomeText: {type: String, default: 'Oh no, {user.name} has left us'}
    },
    autoWeather: {
      channelID: {type: String, default: '-1'},
      city: {type: String, default: 'Москва'},
      hours: {type: Number, default: 24},
      lastSend: {type: Number, default: 0},
    },
  premium: {type: premiumSchema, default: null}
})

module.exports = model("Guild", guild)