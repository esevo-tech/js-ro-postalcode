const utils = require("./utils");
const sqlite3 = require("sqlite3").verbose();

function buildDatabase(countiesFile, postalCodesFile, outputFile) {
  initializeDatabase(outputFile);

  const counties = utils.loadJSON(countiesFile);
  const postalCodes = utils.loadJSON(postalCodesFile);
}

function initializeDatabase(outputFile) {
  utils.deleteFile(outputFile);
  const db = new sqlite3.Database(outputFile);
  const initQuery = utils.getFileContents("./structure.sql");
  db.run(initQuery);
}

buildDatabase(
  "./output/counties.json",
  "./output/postal-codes.json",
  "./output/ro-postal-codes.db"
);