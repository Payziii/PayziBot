const { Schema, model } = require('mongoose');

const chatgpt = Schema({
  messageID: String,
  date: Date,
  data: Array
})

module.exports = model("ChatGPT", chatgpt)