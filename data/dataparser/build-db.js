const utils = require("./utils");
const sqlite3 = require("sqlite3").verbose();

function buildDatabase(countiesFile, postalCodesFile, outputFile) {
  const db = initializeDatabase(outputFile);
  const counties = utils.loadJSON(countiesFile);
  const postalCodes = utils.loadJSON(postalCodesFile);

  const insertCountyQuery = db.prepare("INSERT INTO `counties` (countyId, name) VALUES (?, ?)");
  const insertLocalityQuery = db.prepare("INSERT INTO `localities` (localityId, countyId, name, postalCode) VALUES (?, ?, ?, ?)");

  db.serialize(() => {
    for (const countyName in counties) {
      const county = counties[countyName];
      const countyId = county.index;
      insertCountyQuery.run(countyId, countyName);

      for (const localityName in county.localities) {
        const locality = county.localities[localityName];
        const localityId = locality.index;
        insertLocalityQuery.run(localityId, countyId, localityName, locality.postalCode);
      }
    }

    insertCountyQuery.finalize();
    insertLocalityQuery.finalize();
  });
}

function initializeDatabase(outputFile) {
  utils.deleteFile(outputFile);
  const db = new sqlite3.Database(outputFile);
  const initQuery = utils.getFileContents("./structure.sql");
  db.serialize(() => {
    db.exec(initQuery);
  })
  return db;
}

buildDatabase(
  "./output/counties.json",
  "./output/postal-codes.json",
  "./output/ro-postal-codes.db"
);