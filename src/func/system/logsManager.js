const { channels } = require('../../config.js');

class logsManager {
    constructor(client) {
        this.client = client;
        this.startupSent = false;
    }

    async sendLog(channelId, options = {}) {}

    async sendDailyStat(filePath) {
        this.client.channels.cache.get(channels.statLogs)
        .send({files: [filePath]})
        .catch(() => console.log(`ERROR | Failed to send daily stat to log channel`))
    }

    async sendStartupMessage() {
        if(this.startupSent) return;

        this.client.channels.cache.get(channels.startLogs)
        .send(`<:Bot:732119152755474444> | **${this.client.user.username}** запущен с **${this.client.guilds.cache.size}** серверами`)
        .then(() => this.startupSent = true)
        .catch(() => console.log(`ERROR | Failed to send a startup message to the log channel`))
    }

    async sendDbLog(message) {
        this.client.channels.cache.get(channels.dbLogs)
        .send(message)
        .catch(() => console.log(`ERROR | Failed to send a database log to the log channel`))
    }
}

module.exports = logsManager;