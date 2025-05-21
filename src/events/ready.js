const { Events } = require('discord.js');
const { channels } = require('../config.js');
const BoticordService = require('../func/system/boticord.js');
const dailyStatManager = require('../func/system/dailyStatManager.js');
const { GiveReward } = require('../func/system/upAdded.js');
const cron = require('node-cron');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`ONLINE | Bot: ${client.user.username}`);
		client.channels.cache.get(channels.startLogs)
			.send(`<:Bot:732119152755474444> | **${client.user.username}** запущен с **${client.guilds.cache.size}** серверами`)
			.catch(() => console.log(`ERROR | Failed to send a startup message to the log channel`))

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
		setInterval(() => {
			dailyStat.updateDailyStat();
		}, 15 * 60 * 1000);

		cron.schedule('0 0 * * *', () => {
			dailyStat.clearClientDailyStats();
			dailyStat.generatePreviousDayStatFile();
		});

		dailyStat.on("statGenerated", (filePath) => {
			client.channels.cache.get(channels.statLogs)
			.send({files: [filePath]})
			.catch(() => console.log(`ERROR | Failed to send daily stat to log channel`))
		})
	},
};