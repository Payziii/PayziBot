require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const { channels } = require('./config.js');

const Giveaway = require('./database/giveaway.js');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
	],
	partials: [
		Partials.Reaction,
		Partials.Message,
	],
	presence: {
		status: 'online',
		activities: [{ name: '💚 docs.payzibot.ru', type: ActivityType.Custom }],
	},
});

mongoose.connect(
	process.env.MONGO,
	{ useNewUrlParser: true, useUnifiedTopology: true },
);

client.commands = new Collection();
client.textCommands = new Collection();
client.textAliases = new Collection();
client.cooldowns = new Collection();
client.autoreactChannels = [];
client.cmdsUsed = 0;

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

fs.readdir('./cmds/textCommands/', (err, files) => {
	if (err) console.log(err);

	const jsfile = files.filter(f => f.split('.').pop() === 'js');
	if (jsfile.length <= 0) {
		return console.log('LOGS | Commands not found');
	}

	jsfile.forEach((f) => {
		const pull = require(`./cmds/textCommands/${f}`);
		client.textCommands.set(pull.help.name, pull);
		pull.help.aliases.forEach(alias => {
			client.textAliases.set(alias, pull);
		});
	});
});

process.on('uncaughtException', (err) => {
	console.log(err);
	if(client) client.channels.cache.get(channels.errorLogs).send(`Ошибка: ${err}`);
});

client.on('ready', async () => {
	const commandsPath = path.join(__dirname, 'cmds', 'slashCommands');
	fs.readdirSync(commandsPath).forEach((folder) => {
		const cP = path.join('cmds', 'slashCommands', folder);
		const commandsFiles = fs
			.readdirSync(cP)
			.filter((file) => file.endsWith('js'));
		for (const file of commandsFiles) {
			const filePath = path.join(__dirname, cP, file);
			console.log(`> Loaded: ${file.slice(0, -3)}`);
			const command = require(filePath);
			if('skip' in command) continue;
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			}
			else {
				console.log(`ERROR | In ${filePath} not found "data" or "execute"`);
			}
		}
	});

	try {
		console.log('WAIT | Commands updating');
		await client.application.commands.set(
			client.commands.map((c) => c.data),
		);
		console.log('SUCESS | Commands updating is ended. Bot sucess  launch!');
	}
	catch (error) {
		console.error(error);
	}
});

const { GiveawaysManager } = require('discord-giveaways');
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
	async getAllGiveaways() {
		return await Giveaway.find().lean().exec();
	}

	async saveGiveaway(messageId, giveawayData) {
		await Giveaway.create(giveawayData);
		return true;
	}

	async editGiveaway(messageId, giveawayData) {
		await Giveaway.updateOne({ messageId }, giveawayData).exec();
		return true;
	}

	async deleteGiveaway(messageId) {
		await Giveaway.deleteOne({ messageId }).exec();
		return true;
	}
};

const manager = new GiveawayManagerWithOwnDatabase(client, {
	default: {
		botsCanWin: false,
		embedColor: '#9327e1',
		embedColorEnd: '#9327e1',
		reaction: '🎉',
	},
});

client.giveawaysManager = manager;

client.login(process.env.TOKEN);