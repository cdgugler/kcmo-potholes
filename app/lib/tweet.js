function getCase(cases) {
    const caseToPost = cases.find((c) => !c.posted);
    return caseToPost || false;
}

function getTweet(cases) {
    const mapZoomLevel = 17;
    const currentCase = getCase(cases);
    const mapLink = `https://www.openstreetmap.org/?mlat=${currentCase.lat}&mlon=${currentCase.long}#map=${mapZoomLevel}/${currentCase.lat}/${currentCase.long}`;

    return {
        text: `Pothole reported at ${currentCase.address} ${mapLink}`,
        id: currentCase.id,
        address: currentCase.address,
    };
}

module.exports = {
    getCase,
    getTweet,
};
