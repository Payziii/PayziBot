const config = require('../../config.js');
exports.run = async (client, message, args) => {
	if (!config.owners.includes(author)) return;
		try {
			const exec = require('child_process').exec;
			exec(args.join(' '), { encoding: 'UTF-8' },
				function(error, stdout, stderr) {
					message.channel.send(stdout ? stdout : 'no out.', { split: '\n', code: 'bash' });
					message.channel.send(stderr, { split: '\n', code: 'bash' });
					if (error !== null) {
						console.log('exec error: ' + error);
					}
				});
		}
		catch (err) {
			message.channel.send(err, { split: '\n', code: 'bash' });
		}
};
exports.help = {
	name: ',bash',
	aliases: [',shell', ',console', ',linux'],
	info: 'owner',
	usage: '[Команда]',
	perm: 'Developer',
	description: 'Выполнить команду через консоль',
};