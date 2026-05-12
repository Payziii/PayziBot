const { Events } = require('discord.js');
const { channels } = require('../config.js');
const BoticordService = require('../func/system/boticord.js');
const dailyStatManager = require('../func/system/dailyStatManager.js');
const logsManager = require('../func/system/logsManager.js');
const { GiveReward } = require('../func/system/upAdded.js');
const cron = require('node-cron');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`ONLINE | Bot: ${client.user.username}`);
		client.logsManager = new logsManager(client);
		client.logsManager.sendStartupMessage();

		if(!process.env.BOTICORD_API_KEY) return console.log('Boticord service is not loaded. Please add boticord token in .env file')
		
		const boticord = new BoticordService(process.env.BOTICORD_API_KEY);

		boticord.connect();

		boticord.on("notify", data => {
			if(data.type != 'up_added') return;
			GiveReward(data.user)
			client.channels.cache.get(channels.dbLogs)
			.send(`${data.user} поднял бота!`)
			.catch(() => console.log(`ERROR | Failed to send bot boost message to log channel`))
		})

		const dailyStat = new dailyStatManager(client);
		dailyStat.loadTodayStatToClient();

		cron.schedule('*/15 * * * *', () => {
			dailyStat.updateDailyStat();
		});

		cron.schedule('0 0 * * *', () => {
			dailyStat.clearClientDailyStats();
			dailyStat.generatePreviousDayStatFile();
		});

		dailyStat.on("statGenerated", (filePath) => {
			client.logsManager.sendDailyStat(filePath);
		})
	},
};