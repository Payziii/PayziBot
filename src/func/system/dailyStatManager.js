const { EventEmitter } = require('events');
const DailyStat = require('../../database/dailyStatistic.js');
const fs = require('fs');
const path = require('path');

class dailyStatManager extends EventEmitter {
    constructor(client) {
        super();
        this.client = client;
    }

    async updateDailyStat() {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const dateString = `${day}.${month}.${year}`;

        let dailyStat = await DailyStat.findOne({ date: dateString });
        if (!dailyStat) {
            await DailyStat.create({ date: dateString });
            dailyStat = await DailyStat.findOne({ date: dateString });
        }

        dailyStat.commands.all = this.client.cmdsUsed;
        dailyStat.commands.detailed = new Map(this.client.cmdsDetailed);

        await dailyStat.save();
    }

    async clearClientDailyStats() {
        this.client.cmdsUsed = 0;
        this.client.cmdsDetailed.clear();
    }

    async generatePreviousDayStatFile() {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const dateString = `${day}.${month}.${year}`;

        const dailyStat = await DailyStat.findOne({ date: dateString });
        if (!dailyStat) {
            throw new Error('Нет статистики за предыдущий день');
        }

        if (!fs.existsSync(path.join(__dirname, '../../stats'))) {
            fs.mkdirSync(path.join(__dirname, '../../stats'), { recursive: true });
        }

        const filePath = path.join(__dirname, `../../stats/${dateString}.json`);

        fs.writeFileSync(filePath, JSON.stringify(dailyStat, null, 2), 'utf8');

        this.emit('statGenerated', filePath);
    }

    async loadTodayStatToClient() {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const dateString = `${day}.${month}.${year}`;

        const dailyStat = await DailyStat.findOne({ date: dateString });
        if (!dailyStat) {
            return;
        }

        this.client.cmdsUsed = dailyStat.commands.all;
        this.client.cmdsDetailed = new Map(dailyStat.commands.detailed);
    }
}

module.exports = dailyStatManager;