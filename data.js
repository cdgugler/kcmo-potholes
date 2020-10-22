const { differenceInCalendarDays } = require('date-fns');
const fs = require('fs');

function extractData(data) {
    return data
        .map(d => ({
            id: d.case_id,
            address: d.street_address,
            lat: d.address_with_geocode.latitude,
            long: d.address_with_geocode.longitude,
            created: d.creation_date,
            status: d.status,
            posted: false
    }));
}

function mergeData(currentData, newData) {
    const caseIds = currentData.map(data => data.id);
    const filtered = newData.filter(data => {
        return !caseIds.includes(data.id);
    });

    return [
        ...currentData,
        ...filtered
    ];
}

function removeOldCases(data, currentDate = new Date()) {
    return data.filter(currentCase => {
        const diff = differenceInCalendarDays(currentDate, new Date(currentCase.created));

        if (diff < 30) {
            return true;
        }

        if (diff >= 30 && !currentCase.posted) {
            return true;
        }

        return false;
    });
}

function loadDataFile (filePath) {
    if (!fs.existsSync(filePath)) {
        try {
            fs.writeFileSync(filePath, "[]");
        } catch (error) {
            console.error(error);
        }
    }

    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(err);
        return false;
    }
}

function writeDataFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data));
    } catch (error) {
        console.error(error);
    }

    return data;
}

module.exports = {
    extractData,
    mergeData,
    loadDataFile,
    writeDataFile,
    removeOldCases
};