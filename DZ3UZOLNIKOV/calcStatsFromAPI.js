// calcStatsFromAPI.js

const loadData = require('./loadData');
const calcStats = require('./calcStats');

async function calcStatsFromAPI() {
    const catsInfo = await loadData('https://catfact.ninja/breeds');
    return calcStats(catsInfo);
}

module.exports = calcStatsFromAPI;