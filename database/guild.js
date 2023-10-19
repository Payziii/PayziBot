const { Schema, model } = require('mongoose');

const guild = Schema({
  guildID: String,
    colors: {
      basic: {type: String, default: '#3fcc65'},
      error: {type: String, default: '#ff033e'},
      correct: {type: String, default: '#008000'},
      starboard: {type: String, default: '#cfc50d'}
    },
    starboard: {
      channelID: {type: String, default: '-1'},
      reqReacts: { type: Number, default: 1 },
      customReact: {type: String, default: '⭐'},
      botsCanReact: {type: Boolean, default: false},
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
      leaveText: {type: String, default: 'Oh no, {user.name} has left us'}
    },
  premium: {
    status: {type: Boolean, default: false},
    userID: {type: String, default: '-1'},
    endDate: {type: Number, default: 0},
    startDate: {type: Number, default: 0}
},
  autoreact: {
    channelID: {type: String, default: '-1'},
    reacts: {type: Array, default: []}
},
customCommands: {type: Map, default: []}
})

module.exports = model("Guild", guild)