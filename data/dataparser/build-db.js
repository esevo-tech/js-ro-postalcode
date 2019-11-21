const utils = require("./utils");
const sqlite3 = require("sqlite3").verbose();

function buildDatabase(countiesFile, postalCodesFile, outputFile) {
  const db = initializeDatabase(outputFile);
  const counties = utils.loadJSON(countiesFile);
  const postalCodes = utils.loadJSON(postalCodesFile);

  const insertCountyQuery = db.prepare("INSERT INTO `counties` (countyId, name) VALUES (?, ?)");

  db.serialize(() => {
    for (const countyName in counties) {
      const county = counties[countyName];
      insertCountyQuery.run(county.index, countyName);
    }

    insertCountyQuery.finalize();
  });
}

function initializeDatabase(outputFile) {
  utils.deleteFile(outputFile);
  const db = new sqlite3.Database(outputFile);
  const initQuery = utils.getFileContents("./structure.sql");
  db.serialize(() => {
    db.run(initQuery);
  })
  return db;
}

buildDatabase(
  "./output/counties.json",
  "./output/postal-codes.json",
  "./output/ro-postal-codes.db"
);