const User = require('../../database/user.js');
const { CheckAch } = require('./giveAch.js');

async function Correct(game, id, channel) {
    const user = await User.findOne({ userID: id });
    if (!user) return;

    switch (game) {
        case 'game':
            user.games.game++;
            break;

        case 'city':
            if (user.games.city >= 49) {
                CheckAch(1, id, channel, user);
            }
            user.games.city++;
            break;

        case 'logo':
            user.games.logo++;
            break;

        case 'flag':
            user.games.flag++;
            break;

        case 'country':
            if (user.games.country >= 110) {
                CheckAch(10, id, channel, user);
            }
            user.games.country++;
            break;
    }

    await user.save();
}

module.exports = {
	Correct
};