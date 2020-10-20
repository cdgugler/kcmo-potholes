const { format, subDays } = require('date-fns');

function requestDateFormatted(dateFrom = new Date(), numDaysBefore = 7) {
    return format(subDays(dateFrom, numDaysBefore), "yyyy-MM-dd");
}

function createApiUrl(url, date = requestDateFormatted()) {
    return `${url}?$where=creation_date > '${date}'&status=OPEN`;
}

function randomNumber (start, end) {
  return (Math.floor(Math.random() * (end + 1)) + start);
}

function minutesToMs (n) {
    return n * 1000 * 60;
}

function hoursToMs (n) {
  return minutesToMs(n) * 60;
}

module.exports = {
    requestDateFormatted,
    createApiUrl,
    randomNumber,
    minutesToMs,
    hoursToMs
};