const User = require('../../database/user.js');

async function GiveReward(id) {
    let user = await User.findOne({ userID: id });
    if(!user) return;
    user.imageGens += 15;
    user.save();
}

module.exports = {
	GiveReward
};