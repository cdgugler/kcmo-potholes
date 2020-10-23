const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');
const Twitter = require('twitter-lite');
const { logger } = require('./lib/logger');
const {
    createApiUrl,
    randomNumber,
    minutesToMs,
    hoursToMs,
} = require('./lib/lib');
const {
    extractData,
    loadDataFile,
    writeDataFile,
    mergeData,
    removeOldCases,
    setCasePosted,
} = require('./lib/data');
const { getTweet } = require('./lib/tweet');
const dotfile = dotenv.config({ path: path.join(__dirname, '.env') });

const DATA_FILE_NAME = 'pothole_data.json';
const DATA_FILE_PATH = path.join(__dirname, DATA_FILE_NAME);
const POTHOLE_API_URL = 'https://data.kcmo.org/resource/r2pb-6ie8.json';
const FETCH_CONFIG = {
    method: 'GET',
    headers: { 'X-App-Token': process.env.OPENDATA_TOKEN },
};
const twitterClient = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET_KEY,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET,
});

let cases = [];

async function fetchCases() {
    const response = await fetch(createApiUrl(POTHOLE_API_URL), FETCH_CONFIG);
    const json = await response.json();

    return extractData(json);
}

async function updateCases() {
    const newCases = await fetchCases();
    cases = removeOldCases(mergeData(cases, newCases));
    writeDataFile(DATA_FILE_PATH, cases);
    logger.info('Cases updated');

    setTimeout(updateCases, hoursToMs(12));
}

async function postTweet() {
    const currentHour = new Date().getHours();
    if (currentHour < 8 || currentHour > 22) {
        logger.info(`Not posting at ${currentHour}`);
        setTimeout(postTweet, minutesToMs(randomNumber(35, 65)));
        return;
    }

    const caseToTweet = getTweet(cases);
    const tweet = await twitterClient.post('statuses/update', {
        status: caseToTweet.text,
    });

    logger.info(tweet);
    logger.info(caseToTweet);

    cases = setCasePosted(caseToTweet.id, cases);
    writeDataFile(DATA_FILE_PATH, cases);

    setTimeout(postTweet, minutesToMs(randomNumber(35, 65)));
}

function envVarsSet() {
    let isSet = true;

    if (!process.env.OPENDATA_TOKEN) {
        console.error('OPENDATA_TOKEN not set.');
        isSet = false;
    }

    if (
        !process.env.TWITTER_API_KEY ||
        !process.env.TWITTER_API_SECRET_KEY ||
        !process.env.TWITTER_ACCESS_TOKEN ||
        !process.env.TWITTER_ACCESS_SECRET
    ) {
        console.error('Twitter API keys not set.');
        isSet = false;
    }

    return isSet;
}

async function start() {
    if (!envVarsSet()) {
        return;
    }

    cases = JSON.parse(loadDataFile(DATA_FILE_PATH));
    await updateCases();

    postTweet();
}

start().catch((error) => console.error(error.stack));
