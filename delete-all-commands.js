require('dotenv').config();

const { REST, Routes } = require('discord.js');

const rest = new REST().setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands('576442351426207744'), { body: [] })
	.then(() => console.log('✅ | Все команды успешно удалены!'))
	.catch(console.error);