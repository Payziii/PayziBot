const { Client, GatewayIntentBits, Collection, ActivityType, Partials, EmbedBuilder, ClientUser } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const mongoose = require('mongoose');
const { tokens } = require('./config.js')
const { Configuration, OpenAIApi } = require("openai");

const User = require('./database/user.js');
const Guild = require('./database/guild.js');
const Giveaway = require('./database/giveaway.js');

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
	tokens.mongoURL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
);

let openai = new Array();
for(i = 0; i<tokens.openAI.length; i++) {
	const configuration = new Configuration({
		apiKey: tokens.openAI[i],
	});
	openai.push(new OpenAIApi(configuration))
	}

client.commands = new Collection();
client.textCommands = new Collection();
client.textAliases = new Collection();
client.cooldowns = new Collection();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, openai));
	}
}

fs.readdir('./cmds/textCommands/', (err, files) => {
	if (err) console.log(err);

	let jsfile = files.filter(f => f.split('.').pop() === 'js');
	if (jsfile.length <= 0) {
		return console.log('LOGS | Команды не найдены');
	}

	jsfile.forEach((f, i) => {
		let pull = require(`./cmds/textCommands/${f}`);
		client.textCommands.set(pull.help.name, pull);
		pull.help.aliases.forEach(alias => {
			client.textAliases.set(alias, pull);
		});
	});
});

process.on('uncaughtException', (err) => {
	client.channels.cache.get('1115145596429406280').send(`Ошибка: ${err}`)
})

client.on('ready', async () => {
	const commandsPath = path.join(__dirname, 'cmds', 'slashCommands');
	fs.readdirSync(commandsPath).forEach((folder) => {
		let cP = path.join('cmds', 'slashCommands', folder);
		let commandsFiles = fs
			.readdirSync(cP)
			.filter((file) => file.endsWith('js'));
		for (const file of commandsFiles) {
			const filePath = path.join(__dirname, cP, file);
			console.log(`> Загружен: ${file.slice(0, -3)}`);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(`| ERROR | В ${filePath} нет "data" или "execute"`);
			}
		}
	});

	try {
		console.log('| Обновление команд');
		await client.application.commands.set(
			client.commands.map((c) => c.data)
		);
		console.log('| Обновление команд окончено');
	} catch (error) {
		console.error(error);
	}
});

client.on('messageCreate', async (message) => {
	let msg = message.content;
	if (message.author.bot) return;

	// DB
	let guild = await Guild.findOne({ guildID: message.guild.id });
	let user = await User.findOne({ userID: message.author.id })

	if (!guild) {
		await Guild.create({ guildID: message.guild.id }).then(() => {
			client.channels.cache
				.get('1124261194325299271')
				.send(
					`<:announcement:732128155195801641> | Сервер ${message.guild.name}(${message.guild.id
					}) успешно был добавлен в MongoDB`
				);
		})
	}

	if (!user) {
		await User.create({ userID: message.author.id }).then(() => {
			client.channels.cache
				.get('1124261194325299271')
				.send(
					`<:member:732128945365057546> | Пользователь ${message.author.username}(${message.author.id
					}) успешно был добавлен в MongoDB`
				);
		})
	}

	guild = await Guild.findOne({ guildID: message.guild.id });
	user = await User.findOne({ userID: message.author.id })

	if (!guild) return;
	if (!user) return;
	// DB

	const args = msg
		.trim()
		.split(/ +/g);
	let command = args.shift().toLowerCase();
	let cmd =
		client.textCommands.get(command) ||
		client.textCommands.find(
			cmd => cmd.help.aliases && cmd.help.aliases.includes(command)
		);
	if (!cmd) return;
	cmd.run(client, message, args, guild, user);
});

const { GiveawaysManager } = require('discord-giveaways');
const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    // This function is called when the manager needs to get all giveaways which are stored in the database.
    async getAllGiveaways() {
        // Get all giveaways from the database. We fetch all documents by passing an empty condition.
        return await Giveaway.find().lean().exec();
    }

    // This function is called when a giveaway needs to be saved in the database.
    async saveGiveaway(messageId, giveawayData) {
        // Add the new giveaway to the database
        await Giveaway.create(giveawayData);
        // Don't forget to return something!
        return true;
    }

    // This function is called when a giveaway needs to be edited in the database.
    async editGiveaway(messageId, giveawayData) {
        // Find by messageId and update it
        await Giveaway.updateOne({ messageId }, giveawayData).exec();
        // Don't forget to return something!
        return true;
    }

    // This function is called when a giveaway needs to be deleted from the database.
    async deleteGiveaway(messageId) {
        // Find by messageId and delete it
        await Giveaway.deleteOne({ messageId }).exec();
        // Don't forget to return something!
        return true;
    }
};

// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(client, {
    default: {
        botsCanWin: false,
        embedColor: '#9327e1',
        embedColorEnd: '#9327e1',
        reaction: '🎉'
    }
});
// We now have a giveawaysManager property to access the manager everywhere!
client.giveawaysManager = manager;

client.login(tokens.discord.release);