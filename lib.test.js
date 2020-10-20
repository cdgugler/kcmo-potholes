const { requestDateFormatted, createApiUrl } = require('./lib');

describe('requestDateFormatted', () => {
    test('returns correctly formatted date', () => {
        const date = new Date('2020-10-20T12:00:00.000Z');
        expect(requestDateFormatted(date, 1)).toBe('2020-10-19');
    });
    test('returns formatted date 7 days back by default', () => {
        const date = new Date('2020-10-20T12:00:00.000Z');
        expect(requestDateFormatted(date)).toBe('2020-10-13');
    });
});

describe('createApiUrl', () => {
    test('returns url with soql $where query including date appended', () => {
        const apiUrl = createApiUrl("https://test.local", "2020-10-20");
        expect(apiUrl).toBe("https://test.local?$where=creation_date > '2020-10-20'&status=OPEN")
    });
});