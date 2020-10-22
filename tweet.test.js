const { getTweet, getCase } = require('./tweet')

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
        ]

        expect(getCase(data)).toEqual(
            expect.objectContaining({
                address: '1124 NE 97th Pl',
                lat: '39.270306',
                long: '-94.56589',
                posted: false,
            })
        )
    })

    test('returns empty false if no unposted case available', () => {
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
        ]

        expect(getCase(data)).toEqual(false)
    })
})

describe('getTweet', () => {
    test('returns tweet text for first unposted case', () => {
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
        ]
        const mapLink = `https://www.openstreetmap.org/?mlat=${data[1].lat}&mlon=${data[1].long}#map=17/${data[1].lat}/${data[1].long}`
        const expectedTweet = `Pothole reported at ${data[1].address} ${mapLink}`

        expect(getTweet(data)).toEqual(expectedTweet)
    })
})
