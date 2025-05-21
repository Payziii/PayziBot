const Game = require('../../database/games.js');

async function gameGiveAll(name, id) {
	let game = await Game.findOne({ name: name, id: id });
	if (!game) {
		await Game.create({ name: name, id: id });
		game = await Game.findOne({ name: name, id: id });
		if (!game) return;
	}

	game.all++;
	game.save();
}

async function gameGiveVerno(name, id) {
	let game = await Game.findOne({ name: name, id: id });
	if (!game) {
		await Game.create({ name: name, id: id });
		game = await Game.findOne({ name: name, id: id });
		if (!game) return;
	}

	game.verno++;
	game.save();
}

async function gameGetPercent(name, id) {
	let game = await Game.findOne({ name: name, id: id });
	if (!game) {
		await Game.create({ name: name, id: id });
		game = await Game.findOne({ name: name, id: id });
		if (!game) return;
	}

	const a = await game.verno;
	let b = await game.all;
	b = b != 0 ? b : 1;
	const c = (a / b * 100).toFixed(0);
	return c;
}

module.exports = {
	gameGiveAll,
	gameGiveVerno,
	gameGetPercent,
};