const {
  extractData,
  loadDataFile,
  writeDataFile,
  mergeData,
  removeOldCases,
} = require("./data");
const path = require("path");
const testData = require("./data.test.json");
const { unlinkSync } = require("fs");

describe("extractData", () => {
  test("returns only id, address, lat, long, created, status, and posted properties", () => {
    const filteredData = extractData(testData);
    expect(filteredData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: "7342 Norton Ave",
          created: "2020-10-20T00:00:00.000",
          id: "2020137623",
          lat: "38.992279",
          long: "-94.540011",
          posted: false,
          status: "OPEN",
        }),
      ])
    );
  });
});

describe("loadDataFile", () => {
  test("creates file with empty array if path doesn't exist", () => {
    const fileName = path.join(__dirname, "temporary_test_data_file.json");
    const fileContents = loadDataFile(fileName);

    expect(fileContents).toEqual("[]");

    unlinkSync(fileName);
  });
});

describe("mergeData", () => {
  test("adds new cases to array", () => {
    const currentData = [{ id: "2020137623" }];
    const newData = [{ id: "2020137624" }];
    const expectedResult = [{ id: "2020137623" }, { id: "2020137624" }];

    const result = mergeData(currentData, newData);

    expect(result).toIncludeSameMembers(expectedResult);
  });
  test("removes duplicate cases by id", () => {
    const currentData = [{ id: "2020137623" }, { id: "2020137624" }];
    const newData = [{ id: "2020137624" }, { id: "2020137625" }];
    const expectedResult = [
      { id: "2020137623" },
      { id: "2020137624" },
      { id: "2020137625" },
    ];

    const result = mergeData(currentData, newData);

    expect(result).toIncludeSameMembers(expectedResult);
  });
  test("handles empty currentData", () => {
    const currentData = [];
    const newData = [{ id: "2020137624" }, { id: "2020137625" }];
    const expectedResult = [{ id: "2020137624" }, { id: "2020137625" }];

    const result = mergeData(currentData, newData);

    expect(result).toIncludeSameMembers(expectedResult);
  });
});

describe("removeOldCases", () => {
  test('removes cases older than 30 days', () => {
    const testCases = [
      {
        created: "2020-09-30T00:00:00.000",
        posted: true
      },
      {
        created: "2020-10-18T00:00:00.000",
        posted: false
      },
    ];

    const expectedResult = [
      {
        created: "2020-10-18T00:00:00.000",
        posted: false
      }
    ];

    const currentDate = new Date('2020-10-31');
    expect(removeOldCases(testCases, currentDate)).toIncludeSameMembers(expectedResult);
  });

  test('only removes cases older than 30 days if posted already', () => {
    const testCases = [
      {
        created: "2020-09-30T00:00:00.000",
        posted: false
      },
      {
        created: "2020-10-18T00:00:00.000",
        posted: false
      },
    ];

    const expectedResult = [
      {
        created: "2020-09-30T00:00:00.000",
        posted: false
      },
      {
        created: "2020-10-18T00:00:00.000",
        posted: false
      },
    ];

    const currentDate = new Date('2020-10-31');
    expect(removeOldCases(testCases, currentDate)).toIncludeSameMembers(expectedResult);
  });
});
