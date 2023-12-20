require('dotenv').config();
const { Client, GatewayIntentBits, Collection, ActivityType, Partials } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const { channels } = require('./config.js');
const { Configuration, OpenAIApi } = require('openai');

const User = require('./database/user.js');
const Guild = require('./database/guild.js');
const Giveaway = require('./database/giveaway.js');

// NEW YEAR ACHVIEVEMENT
const { CheckAch } = require('./func/games/giveAch.js');

const client = new Client({
	intents: [
		GatewayIntentBits.GuildVoiceStates,
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
		activities: [{ name: 'PayziBot — Зелёный бот', type: ActivityType.Custom }],
	},
});

mongoose.connect(
	process.env.MONGO,
	{ useNewUrlParser: true, useUnifiedTopology: true },
);

const openai = new Array();
let tokens = process.env.OPENAI.split(", ");
for (let i = 0; i < tokens.length; i++) {
	const configuration = new Configuration({
		apiKey: tokens[i],
	});
	openai.push(new OpenAIApi(configuration));
}

client.commands = new Collection();
client.textCommands = new Collection();
client.textAliases = new Collection();
client.cooldowns = new Collection();
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
		client.on(event.name, (...args) => event.execute(...args, client, openai));
	}
}

fs.readdir('./cmds/textCommands/', (err, files) => {
	if (err) console.log(err);

	const jsfile = files.filter(f => f.split('.').pop() === 'js');
	if (jsfile.length <= 0) {
		return console.log('LOGS | Команды не найдены');
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
	client.channels.cache.get(channels.errorLogs).send(`Ошибка: ${err}`);
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
			console.log(`> Загружен: ${file.slice(0, -3)}`);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			}
			else {
				console.log(`| ERROR | В ${filePath} нет "data" или "execute"`);
			}
		}
	});

	try {
		console.log('| Обновление команд');
		await client.application.commands.set(
			client.commands.map((c) => c.data),
		);
		console.log('| Обновление команд окончено. Бот успешно запущен!');
	}
	catch (error) {
		console.error(error);
	}
});

client.on('messageCreate', async (message) => {
	const msg = message.content;
	if (message.author.bot) return;

	// DB
	let guild = await Guild.findOne({ guildID: message.guild.id });
	let user = await User.findOne({ userID: message.author.id });

	if (!guild) {
		await Guild.create({ guildID: message.guild.id }).then(() => {
			client.channels.cache
				.get(channels.dbLogs)
				.send(
					`<:announcement:732128155195801641> | Сервер ${message.guild.name}(${message.guild.id
					}) успешно был добавлен в MongoDB`,
				);
		});
	}

	if (!user) {
		await User.create({ userID: message.author.id }).then(() => {
			client.channels.cache
				.get(channels.dbLogs)
				.send(
					`<:member:732128945365057546> | Пользователь ${message.author.username}(${message.author.id
					}) успешно был добавлен в MongoDB`,
				);
		});
	}

	guild = await Guild.findOne({ guildID: message.guild.id });
	user = await User.findOne({ userID: message.author.id });

	if (!guild) return;
	if (!user) return;
	// DB

	// NEW YEAR ACHVIEVEMENT
	if(message.createdTimestamp > 1704049199000) {
		CheckAch(6, message.author.id, message.channel)
	}
	// NEW YEAR ACHVIEVEMENT

	const args = msg
		.trim()
		.split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd =
		client.textCommands.get(command) ||
		client.textCommands.find(
			cm => cm.help.aliases && cm.help.aliases.includes(command),
		);
	if (!cmd) return;
	cmd.run(client, message, args, guild, user);
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