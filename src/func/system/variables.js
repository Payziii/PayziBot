const replaceVars = (text, data = {}) => {
    const { guild, message, member } = data || {};

    if(!text || typeof text != 'string') return text;

    return text
        .replace('{user.mention}', member ? member : message.author)
        .replace('{user.name}', member ? member.user.username : message.author.username)
        .replace('{user.id}', member ? member.id : message.author.id)
        .replace('{guild.name}', guild ? guild.name : message.guild.name)
        .replace('{guild.memberCount}', guild ? guild.members.cache.filter(c => c.user.bot == false).size : message.guild.members.cache.filter(c => c.user.bot == false).size)
        .replace('{guild.botCount}', guild ? guild.members.cache.filter(c => c.user.bot == true).size : message.guild.members.cache.filter(c => c.user.bot == true).size)
        .replace('{guild.channelCount}', guild ? guild.channels.cache.size : message.guild.channels.cache.size)
        .replace('{guild.boosts}', guild ? guild.premiumSubscriptionCount : message.guild.premiumSubscriptionCount);
}

module.exports = {
    replaceVars
}