const User = require('../../database/user.js');

/**
 * Очки рейтинга за разные исходы. Настрой под себя.
 */
const RATING_POINTS = {
    win: 10,
    loss: -5,
    draw: 2,
};

/**
 * Увеличить счётчик сыгранных партий в конкретной игре.
 * @param {string} userID
 * @param {string} gameName - например 'wordle', '2048', 'ttt'
 */
async function incrementPlayed(userID, gameName) {
    return User.findOneAndUpdate(
        { userID },
        {
            $inc: { [`stats.${gameName}.played`]: 1 },
            $set: { [`stats.${gameName}.lastPlayed`]: new Date() },
        },
        { upsert: true, new: true }
    );
}

/**
 * Записать победу. Инкрементит wins, played, обновляет рейтинг и дату.
 * @param {string} userID
 * @param {string} gameName
 * @param {number} [ratingPoints] - переопределить дефолтные очки рейтинга
 */
async function recordWin(userID, gameName, ratingPoints = RATING_POINTS.win) {
    return User.findOneAndUpdate(
        { userID },
        {
            $inc: {
                [`stats.${gameName}.wins`]: 1,
                [`stats.${gameName}.played`]: 1,
                [`stats.${gameName}.rating`]: ratingPoints,
            },
            $set: { [`stats.${gameName}.lastPlayed`]: new Date() },
        },
        { upsert: true, new: true }
    );
}

/**
 * Записать поражение.
 * @param {string} userID
 * @param {string} gameName
 * @param {number} [ratingPoints]
 */
async function recordLoss(userID, gameName, ratingPoints = RATING_POINTS.loss) {
    return User.findOneAndUpdate(
        { userID },
        {
            $inc: {
                [`stats.${gameName}.losses`]: 1,
                [`stats.${gameName}.played`]: 1,
                [`stats.${gameName}.rating`]: ratingPoints,
            },
            $set: { [`stats.${gameName}.lastPlayed`]: new Date() },
        },
        { upsert: true, new: true }
    );
}

/**
 * Записать ничью.
 * @param {string} userID
 * @param {string} gameName
 * @param {number} [ratingPoints]
 */
async function recordDraw(userID, gameName, ratingPoints = RATING_POINTS.draw) {
    return User.findOneAndUpdate(
        { userID },
        {
            $inc: {
                [`stats.${gameName}.draws`]: 1,
                [`stats.${gameName}.played`]: 1,
                [`stats.${gameName}.rating`]: ratingPoints,
            },
            $set: { [`stats.${gameName}.lastPlayed`]: new Date() },
        },
        { upsert: true, new: true }
    );
}

/**
 * Обновить лучший результат (score), если новый выше текущего.
 * Использует $max — атомарно, без необходимости сначала читать текущее значение.
 * @param {string} userID
 * @param {string} gameName
 * @param {number} score
 */
async function updateBestScore(userID, gameName, score) {
    return User.findOneAndUpdate(
        { userID },
        {
            $max: { [`stats.${gameName}.bestScore`]: score },
            $set: { [`stats.${gameName}.lastPlayed`]: new Date() },
        },
        { upsert: true, new: true }
    );
}

/**
 * Универсальная функция для конца игры — вызывай один раз при gameOver.
 * Сама решает, что инкрементить, на основе переданного результата.
 *
 * @param {string} userID
 * @param {string} gameName
 * @param {Object} options
 * @param {'win'|'loss'|'draw'} [options.result] - исход, если игра соревновательная
 * @param {number} [options.score] - очки, если игра на score (2048, snake и т.п.)
 *
 * @example
 * // Соревновательная игра (ttt, connect4)
 * await recordGameEnd(userID, 'ttt', { result: 'win' });
 *
 * @example
 * // Игра на очки (2048, snake)
 * await recordGameEnd(userID, '2048', { score: 4096 });
 *
 * @example
 * // Игра на очки, где важна и победа (например, дошёл до цели)
 * await recordGameEnd(userID, '2048', { result: 'win', score: 4096 });
 */
async function recordGameEnd(userID, gameName, { result, score } = {}) {
    if (result === 'win') await recordWin(userID, gameName);
    else if (result === 'loss') await recordLoss(userID, gameName);
    else if (result === 'draw') await recordDraw(userID, gameName);
    else await incrementPlayed(userID, gameName); // просто засчитать партию, без исхода

    if (typeof score === 'number') {
        await updateBestScore(userID, gameName, score);
    }
}

/**
 * Получить статистику пользователя по конкретной игре.
 * @param {string} userID
 * @param {string} gameName
 * @returns {Promise<Object|null>}
 */
async function getStats(userID, gameName) {
    const doc = await User.findOne({ userID }, { [`stats.${gameName}`]: 1 });
    if (!doc || !doc.stats) return null;
    return doc.stats.get(gameName) || null;
}

/**
 * Топ игроков по конкретной игре (по победам).
 * @param {string} gameName
 * @param {number} [limit=10]
 * @param {'wins'|'bestScore'|'rating'} [sortBy='wins']
 */
async function getTop(gameName, limit = 10, sortBy = 'wins') {
    return User.aggregate([
        { $match: { [`stats.${gameName}`]: { $exists: true } } },
        {
            $project: {
                userID: 1,
                stat: `$stats.${gameName}`,
            },
        },
        { $sort: { [`stat.${sortBy}`]: -1 } },
        { $limit: limit },
    ]);
}

module.exports = {
    incrementPlayed,
    recordWin,
    recordLoss,
    recordDraw,
    updateBestScore,
    recordGameEnd,
    getStats,
    getTop,
};