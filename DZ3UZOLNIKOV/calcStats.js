// calcStats.js

function calcStats(catsInfo) {
    const countryCounts = {};

    catsInfo.forEach(cat => {
        if (cat.country in countryCounts) {
            countryCounts[cat.country]++;
        } else {
            countryCounts[cat.country] = 1;
        }
    });

    return countryCounts;
}

module.exports = calcStats;