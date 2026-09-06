const { SlashCommandBuilder } = require('discord.js');
const User = require('../../../database/user.js');
const block = require('../../../games_src/profile/block.json');
const ach = require('../../../games_src/profile/achievements.json');
const { emojis } = require('../../../config.js');
const { getLevelGuild, getLevelUserByGuild, MathNextLevel } = require('../../../database/levels.js');
const plural = require('../../../func/plural.js');

const IS_COMPONENTS_V2 = 1 << 15;

const GAME_DISPLAY_NAMES = {
	'2048': '2048',
	flood: "Цветовое поле",
	connect4: '4 в ряд',
	memory: "Найдите пары",
	minesweeper: 'Сапёр',
	snake: 'Змейка',
	ttt: 'Крестики-Нолики',
	guess: 'Угадайка',
	hangman: 'Виселица',
	wordle: 'Ворддли',
	longwords: 'Длинные слова',
};

const GAMES_BREAKDOWN = [
	{ key: '2048', type: 'score' },
	{ key: 'flood', type: 'winloss' },
	{ key: 'connect4', type: 'winloss' },
	{ key: 'memory', type: 'played' },
	{ key: 'minesweeper', type: 'winloss' },
	{ key: 'snake', type: 'score' },
];

function hexToInt(hex) {
	if (!hex) return undefined;
	const parsed = parseInt(hex.replace('#', ''), 16);
	return Number.isNaN(parsed) ? undefined : parsed;
}

function emptyStat() {
	return { wins: 0, losses: 0, draws: 0, played: 0, bestScore: 0 };
}

function getStat(user, gameName) {
	if (!user.stats) return emptyStat();
	const stat = user.stats.get ? user.stats.get(gameName) : user.stats[gameName];
	return stat || emptyStat();
}

function buildGameStatLine({ key, type }, user) {
	const name = GAME_DISPLAY_NAMES[key] || key;
	const stat = getStat(user, key);

	let body;
	if (type === 'score') {
		body = `Лучший рекорд: **${stat.bestScore}**\nСыграно: **${stat.played}** ${plural(stat.played, 'раз', 'раза', 'раз')}`;
	} else if (type === 'winloss') {
		body = `Побед: **${stat.wins}**\nПоражений: **${stat.losses}**`;
	} else {
		body = `Сыграно: **${stat.played}** ${plural(stat.played, 'раз', 'раза', 'раз')}`;
	}

	return `## ${name}\n${body}`;
}

function getTotalPlayed(user) {
	if (!user.stats) return 0;
	let total = 0;
	for (const stat of user.stats.values()) {
		total += stat.played || 0;
	}
	return total;
}

function getTop3Games(user) {
	if (!user.stats || user.stats.size === 0) return [];
	return [...user.stats.entries()]
		.map(([key, stat]) => ({ key, played: stat.played || 0 }))
		.filter((entry) => entry.played > 0)
		.sort((a, b) => b.played - a.played)
		.slice(0, 3);
}

function separator() {
	return { type: 14, spacing: 1, divider: true };
}

function textDisplay(content) {
	return { type: 10, content };
}

function headerSection(title, avatarURL) {
	return {
		type: 9,
		components: [textDisplay(title)],
		accessory: {
			type: 11,
			media: { url: avatarURL },
		},
	};
}

function button(label, customId, disabled) {
	return {
		type: 2,
		style: 1,
		label,
		custom_id: customId,
		disabled: !!disabled,
	};
}

function actionRow(buttons) {
	return { type: 1, components: buttons };
}

function buildMainContainer({ user, _user, lvlMess, avatarURL, accentColor, disabled }) {
	const blockMessage = user.block >= 1 ? `\n${block[user.block].emoji} Блокировка: **${block[user.block].name}**` : '';
	const top3 = getTop3Games(user);
	const top3Text = top3.length
		? top3
				.map((entry, i) => `${i + 1}. ${GAME_DISPLAY_NAMES[entry.key] || entry.key} — **${entry.played} ${plural(entry.played, 'игра', 'игры', 'игр')}**`)
				.join('\n')
		: 'Пользователь ещё не играл ни в одну игру';

	const components = [
		headerSection(`# ${_user.username}\n${user.bio}${blockMessage}`, avatarURL),
		separator(),
		textDisplay(lvlMess),
		separator(),
		textDisplay(`Получено достижений: **${user.ach.length}**`),
		separator(),
		textDisplay(`## Топ 3 игр\n${top3Text}`),
		actionRow([
			button('Игры', 'profile_games', disabled),
			button('Достижения', 'profile_ach', disabled),
		]),
	];

	return { type: 17, accent_color: accentColor, components };
}

function buildAchContainer({ user, _user, avatarURL, accentColor, disabled }) {
	const text = user.ach
		.map((id) => {
			const achievement = ach.find((x) => x.id === id);
			if (!achievement) return null;
			const t = achievement.translatable?.ru;
			return `${achievement.badge} | ${t?.title || ''}\n-# ${t?.description || ''}`;
		})
		.filter(Boolean)
		.join('\n');

	const components = [
		headerSection(`# Достижения ${_user.username}\nПолучено **${user.ach.length}** ${plural(user.ach.length, 'достижение', 'достижения', 'достижений')}`, avatarURL),
		separator(),
		textDisplay(text || 'Отсутствуют'),
		actionRow([
			button('Игры', 'profile_games', disabled),
			button('Общее', 'profile_main', disabled),
		]),
	];

	return { type: 17, accent_color: accentColor, components };
}

function buildGamesContainer({ user, _user, avatarURL, accentColor, disabled }) {
	const totalPlayed = getTotalPlayed(user);
	const playedGames = GAMES_BREAKDOWN.filter((game) => getStat(user, game.key).played > 0);

	const components = [
		headerSection(`# Игры ${_user.username}\nСыграл **${totalPlayed}** ${plural(totalPlayed, 'раз', 'раза', 'раз')}`, avatarURL),
		separator(),
	];

	if (playedGames.length === 0) {
		components.push(textDisplay('Пользователь ещё не играл ни в одну игру'));
	} else {
		playedGames.forEach((game, i) => {
			components.push(textDisplay(buildGameStatLine(game, user)));
			if (i < playedGames.length - 1) components.push(separator());
		});
	}

	components.push(separator());
	components.push(
		actionRow([
			button('Общее', 'profile_main', disabled),
			button('Достижения', 'profile_ach', disabled),
		])
	);

	return { type: 17, accent_color: accentColor, components };
}

module.exports = {
	category: 'games',
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Профиль PayziBot')
		.addUserOption((option) =>
			option.setName('пользователь').setDescription('Пользователь, чей профиль вы смотрите')
		),
	async execute(interaction, guild) {
		await interaction.deferReply();
		const _user = interaction.options.getUser('пользователь') || interaction.user;

		const user = await User.findOne({ userID: _user.id });
		if (!user) return interaction.editReply(`${emojis.error} | К сожалению, пользователь \`${_user.username}\` не использовал бота!`);

		let lvlMess;
		const g = await getLevelGuild(interaction.guild.id);
		if (!g.enabled) {
			lvlMess = 'На сервере отключена система уровней';
		} else {
			const us = await getLevelUserByGuild(interaction.guild.id, _user.id);
			lvlMess = `Уровень: **${us.level}**\nXP: **${us.xp}**/**${MathNextLevel(us.level, g.xp.koeff)}**`;
		}

		const avatarURL = _user.displayAvatarURL({ extension: 'webp', size: 4096 });
		const accentColor = hexToInt(guild.colors?.basic);
		const ctx = { user, _user, lvlMess, avatarURL, accentColor };

		let currentPage = 'main';
		const pageBuilders = {
			main: buildMainContainer,
			ach: buildAchContainer,
			games: buildGamesContainer,
		};

		const response = await interaction.editReply({
			flags: IS_COMPONENTS_V2,
			components: [pageBuilders[currentPage]({ ...ctx, disabled: false })],
		});

		const collectorFilter = (i) => i.user.id === interaction.user.id;
		const collector = response.createMessageComponentCollector({ filter: collectorFilter, idle: 60_000 });

		collector.on('collect', async (i) => {
			if (i.customId === 'profile_ach') currentPage = 'ach';
			else if (i.customId === 'profile_games') currentPage = 'games';
			else if (i.customId === 'profile_main') currentPage = 'main';

			await i.update({
				flags: IS_COMPONENTS_V2,
				components: [pageBuilders[currentPage]({ ...ctx, disabled: false })],
			});
		});

		collector.on('end', async () => {
			try {
				await response.edit({
					flags: IS_COMPONENTS_V2,
					components: [pageBuilders[currentPage]({ ...ctx, disabled: true })],
				});
			} catch (e) {
			}
		});
	},
};