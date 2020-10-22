require('dotenv').config();
const path = require('path');
const fetch = require('node-fetch');
const { createApiUrl, randomNumber, minutesToMs, hoursToMs } = require('./lib');
const { extractData, loadDataFile, writeDataFile, mergeData, removeOldCases } = require('./data');

const DATA_FILE_NAME = "pothole_data.json";
const DATA_FILE_PATH = path.join(__dirname, DATA_FILE_NAME);
const POTHOLE_API_URL = 'https://data.kcmo.org/resource/r2pb-6ie8.json';
const FETCH_CONFIG = {
    method: 'GET',
    headers: { 'X-App-Token': process.env.OPENDATA_TOKEN }
};

let cases = [];

async function fetchCases() {
    const response = await fetch(
        createApiUrl(POTHOLE_API_URL), 
        FETCH_CONFIG
    );
    const json = await response.json();

    return extractData(json);
}

async function updateCases() {
    const newCases = await fetchCases();
    cases = removeOldCases(mergeData(cases, newCases));
    writeDataFile(DATA_FILE_PATH, cases);

    setTimeout(updateCases, hoursToMs(12));
}

function startTweeting() {
    // TODO: Pick first pothole that hasn't posted yet (order by date)
    // Tweet: street address and GPS Coords
    // Tweet format 'Pothole reported at <address> openstreetmap link';
    // set it to posted

    const currentHour = new Date().getHours();
    if (currentHour < 8 || currentHour > 22 ) {
        return;
    }

    setTimeout(startTweeting, minutesToMs(randomNumber(35, 65)));
}

async function start() {
    const cases = JSON.parse(loadDataFile(DATA_FILE_PATH));
    updateCases();

    startTweeting();
}

start().catch(error => console.error(error.stack));