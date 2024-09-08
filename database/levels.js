// Использование lmdb-js
// Используется для хранения уровней пользователей

const { open } = require('lmdb');

// Открываем бд для хранения уровней
let levelsDB = open({
	path: 'levels-db',
	compression: true,
});

function MathNextLevel(current, koeff) {
    return 100*(current*1.7+1)*koeff;
}

/**
 * Создание нового сервера в базе данных
 * 
 * @param {string} guildID 
 */
async function createLevelGuild(guildID) {
    await levelsDB.put(guildID, {
        enabled: true,
        interval: 60,
        xp: {
            min: 1,
            max: 5,
            koeff: 0.7
        },
        channelID: "-1",
        messageEnabled: true,
        message: "🎉 Поздравляем, {user.mention}, вы достигли **{level}** уровня!",
        roles: [],
        data: [] // {user, xp, level, lastMessage}, {}
    })

    return true;
}

/**
 * Получение сервера в базе данных
 * 
 * @param {string} guildID 
 */
async function getLevelGuild(guildID) {
    let guild = levelsDB.get(guildID);
    if(guild == undefined) {
        await createLevelGuild(guildID);
        guild = levelsDB.get(guildID);
    }

    return guild;
}

/**
 * Включить или отключить лвл-систему на сервере
 * 
 * @param {string} guildID 
 * @param {boolean} status 
 */
async function setLevelGuildEnabled(guildID, status) {
    const guild = await getLevelGuild(guildID);
    guild.enabled = status;
    levelsDB.put(guildID, guild);
    
    return true;
}

/**
 * Обновить информацию о юзере
 * 
 * @param {string} guildID 
 * @param {*} user
 */
async function putLevelUser(guildID, user) {
    const guild = await getLevelGuild(guildID);
    const { data } = guild;
    let u = data.find(us => us.user === user.user); 
    data[data.indexOf(u)] = user;
    guild.data = data;
    levelsDB.put(guildID, guild);
    
    return true;
}

/**
 * Получение инфорамции о пользователе на сервере
 * 
 * @param {string} guildID 
 * @param {string} userID 
 */
async function getLevelUserByGuild(guildID, userID) {
    const guild = await getLevelGuild(guildID);
    const { data } = guild;
    let user = data.find(user => user.user === userID);
    if(!user) return user = await setLevelUserByGuild(guildID, userID);

    return user;
}

/**
 * Добавление инфорамции о пользователе на сервере
 * 
 * @param {string} guildID 
 * @param {string} userID 
 */
async function setLevelUserByGuild(guildID, userID) {
    let guild = await getLevelGuild(guildID);
    const data = {user: userID, xp: 0, level: 0, lastMessage: 1 };
    guild.data.push(data);
    levelsDB.put(guildID, guild);

    return data;
}

module.exports = {
    MathNextLevel,
    createLevelGuild,
    getLevelGuild,
    setLevelGuildEnabled,
    putLevelUser,
    getLevelUserByGuild
}