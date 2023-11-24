const { REST, Routes } = require('discord.js');

const rest = new REST().setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands('576442351426207744'), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);