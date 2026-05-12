const { channels } = require('../../config.js');

class logsManager {
    constructor(client) {
        this.client = client;
    }

    async sendLog(channelId, options = {}) {}

    // async sendDailyStat(filePath) {
    //     this.client.channels.cache.get(channels.statLogs)
    //     .send({files: [filePath]})
    //     .catch(() => console.log(`ERROR | Failed to send daily stat to log channel`))
    // }
}

module.exports = logsManager;