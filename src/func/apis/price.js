async function convert(key, from, to, amount) {
    let answer;
    await require('node-fetch')(`https://api.currencybeacon.com/v1/convert?api_key=${key}&from=${from}&to=${to}&amount=${amount}`).then(r => r.json()).then(r => {
        answer = r;
    }).catch(e => {
        console.log(e);
        answer = 'error';
    });
    return answer;
}


module.exports = {
    convert
};