const { Client, GatewayIntentBits, Collection, ActivityType, Partials, EmbedBuilder } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const { SpotifyExtractor, SoundCloudExtractor } = require('@discord-player/extractor');
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require('mongoose');

const User = require('./database/user.js');
const Guild = require('./database/guild.js');

const client = new Client({
    intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
    ],
  partials: [
    Partials.Reaction,
    Partials.Message,
  ],
    presence: {
        status: "online",
        activities: [{name: "/help | PayziBot", type: ActivityType.Competing}],
    },
});

mongoose.connect(
	'mongodb+srv://Mikhail:Mikhail2008@cluster0.b7l4v.mongodb.net/PayziBot?retryWrites=true&w=majority',
	{ useNewUrlParser: true, useUnifiedTopology: true }
);

const player = new Player(client);
player.extractors.loadDefault();

client.commands = new Collection();
client.textCommands = new Collection();
client.textAliases = new Collection();

player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`<:voice:732128155418099733> | Сейчас играет: **${track.title}**`);
});

player.events.on('disconnect', (queue) => {
    queue.metadata.channel.send(`<:Disconnect_white:1112604723523100772> | Я покинул голосовой канал`);
});

player.events.on('emptyQueue', (queue) => {
    queue.metadata.channel.send(`<:Disconnect_white:1112604723523100772> | Очередь для музыки пуста, отключусь через 3 минуты`);
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, player, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, player, client));
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

client.on("ready", async () => {
    const commandsPath = path.join(__dirname, "cmds", "slashCommands");
    fs.readdirSync(commandsPath).forEach((folder) => {
        let cP = path.join("cmds", "slashCommands", folder);
        let commandsFiles = fs
            .readdirSync(cP)
            .filter((file) => file.endsWith("js"));
        for (const file of commandsFiles) {
            const filePath = path.join(__dirname, cP, file);
            console.log(`> Загружен: ${file.slice(0, -3)}`);
            const command = require(filePath);
            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`| ERROR | В ${filePath} нет "data" или "execute"`);
            }
        }
    });

    try {
        console.log("| Обновление команд");
        await client.application.commands.set(
            client.commands.map((c) => c.data)
        );
        console.log("| Обновление команд окончено");
    } catch (error) {
        console.error(error);
    }
});

client.on("messageReactionAdd", async (react, user) => {
    if (react.message.partial) await react.message.fetch()
    if (react.partial) await react.fetch()
    if(react.emoji.name != '⭐') return;
    let guild = await Guild.findOne({ guildID: react.message.guild.id });
    if (!guild) return;
    if(guild.settings.starboard.channelID == '-1') return;
    if(react.count < guild.settings.starboard.reqReacts) return;
    let messageAttachment = react.message.attachments.size > 0 ? Array.from(react.message.attachments.values())[0].url : null

    const embed = new EmbedBuilder()
  .setAuthor({
    name: react.message.author.username,
    iconURL: react.message.author.displayAvatarURL(),
  })
  .setColor(guild.settings.other.color)
  .setImage(messageAttachment);
  let content = react.message.content.replaceAll(" ", "")
  if(content.length > 0) embed.setDescription(react.message.content || "Пустая строка");
  let msg = guild.settings.starboard.data.get(react.message.id);
  if(msg == undefined) {
    react.message.guild.channels.cache.get(guild.settings.starboard.channelID).send({content: `⭐ **${react.count}:** ${react.message.url}`, embeds: [embed] })
    .then(message => {
        guild.settings.starboard.data.set(react.message.id, message.id)
        guild.save()
    })
    .catch(e => console.log(e));
  }else{
    react.message.guild.channels.cache.get(guild.settings.starboard.channelID).messages.cache.get(msg).edit({content: `⭐ **${react.count}:** ${react.message.url}`, embeds: [embed] })
    .catch(e => console.log(e));
  }

    console.log(react.count)
    console.log(user)
})
client.on("messageCreate", async (message) => {
    let msg = message.content;
    if (message.author.bot) return;

    // DB
    let guild = await Guild.findOne({ guildID: message.guild.id });

    if (!guild) {
		await Guild.create({ guildID: message.guild.id });
		client.channels.cache
			.get('1124261194325299271')
			.send(
				`:white_check_mark: | Сервер ${message.guild.name}(${
					message.guild.id
				}) успешно был добавлен в БД`
			);
	}
    guild = await Guild.findOne({ guildID: message.guild.id });

    if (!guild) return message.reply("1")
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
	cmd.run(client, message, args, player, guild);
});

client.login("NTc2NDQyMzUxNDI2MjA3NzQ0.GeV65R.R0P6_sBW9WwFTwL0K3qN1K9I49phKdtUpD6qXA");
// NzMyODY3OTY1MDUzMDQyNjkw.G5HoqK.H6g0KAXwGossSDMnzPZh0ByiNzifYAOdB7MgO8 - PB23
// NTc2NDQyMzUxNDI2MjA3NzQ0.GeV65R.R0P6_sBW9WwFTwL0K3qN1K9I49phKdtUpD6qXA - PB