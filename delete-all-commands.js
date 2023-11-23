const { REST, Routes } = require('discord.js');

const rest = new REST().setToken('NTc2NDQyMzUxNDI2MjA3NzQ0.GeV65R.R0P6_sBW9WwFTwL0K3qN1K9I49phKdtUpD6qXA');

rest.put(Routes.applicationCommands('576442351426207744'), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);