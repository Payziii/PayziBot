async function getServer(ip) {
    let answer;
    await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(ip)}`).then(r => r.json()).then(r => {
        answer = r;
    }).catch(e => {
        console.log(e);
        answer = 'error';
    });
    return answer;
}

async function getPlayer(name) {
    let answer;
    await fetch(`https://playerdb.co/api/player/minecraft/${name}`).then(r => r.json()).then(r => {
        answer = r;
    }).catch(e => {
        console.log(e);
        answer = 'error';
    });
    return answer;
}


module.exports = {
    getServer,
    getPlayer
};