const User = require('../../database/user.js');

async function CorrectGame(id) {
    user = await User.findOne({ userID: id })
    if(!user) return;
    user.games.game++;
    user.save()
}

async function CorrectCity(id) {
    user = await User.findOne({ userID: id })
    if(!user) return;
    user.games.city++;
    user.save()
}

async function CorrectLogo(id) {
    user = await User.findOne({ userID: id })
    if(!user) return;
    user.games.logo++;
    user.save()
}

async function CorrectFlag(id) {
    user = await User.findOne({ userID: id })
    if(!user) return;
    user.games.flag++;
    user.save()
}

module.exports = {
    CorrectGame,
    CorrectCity,
    CorrectLogo,
    CorrectFlag
}