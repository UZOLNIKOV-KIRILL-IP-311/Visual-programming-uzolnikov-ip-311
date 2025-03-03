// loadData.js

const fetch = require('node-fetch');

async function loadData(url) {
    let allData = [];
    let currentPageUrl = url;

    while (currentPageUrl) {
        const response = await fetch(currentPageUrl);
        const data = await response.json();
        allData = allData.concat(data.data);

        currentPageUrl = data.next_page_url;
    }

    return allData;
}

module.exports = loadData;