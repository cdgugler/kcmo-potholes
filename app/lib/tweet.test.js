const { getTweet, getCase } = require('./tweet');

describe('getCase', () => {
    test('returns first unposted case', () => {
        const data = [
            {
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: true,
            },
            {
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: false,
            },
            {
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: false,
            },
        ];

        expect(getCase(data)).toEqual(
            expect.objectContaining({
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: false,
            })
        );
    });

    test('getCase returns empty false if no unposted case available', () => {
        const data = [
            {
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: true,
            },
            {
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: true,
            },
            {
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: true,
            },
        ];

        expect(getCase(data)).toEqual(false);
    });

    test('getTweet returns empty false if no unposted case available', () => {
        const data = [
            {
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: true,
            },
            {
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: true,
            },
            {
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: true,
            },
        ];

        expect(getTweet(data)).toEqual(false);
    });
});

describe('getTweet', () => {
    test('returns tweet text and id for first unposted case', () => {
        const data = [
            {
                id: '2020137100',
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: true,
            },
            {
                id: '2020137101',
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: false,
            },
            {
                id: '2020137102',
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: false,
            },
        ];
        const mapLink = `https://www.openstreetmap.org/?mlat=${data[1].lat}&mlon=${data[1].long}#map=17/${data[1].lat}/${data[1].long}`;
        const expectedTweet = {
            text: `Pothole reported at ${data[1].address} ${mapLink}`,
            id: '2020137101',
        };

        expect(getTweet(data)).toEqual(expect.objectContaining(expectedTweet));
    });
});
