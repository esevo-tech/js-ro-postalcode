const utils = require("./utils");
const sqlite3 = require("sqlite3").verbose();

function buildDatabase(countiesFile, postalCodesFile, outputFile) {
  const db = initializeDatabase(outputFile);
  const counties = utils.loadJSON(countiesFile);
  const postalCodes = utils.loadJSON(postalCodesFile);

  const insertCountyQuery = db.prepare("INSERT INTO `counties` (countyId, name) VALUES (?, ?)");
  const insertLocalityQuery = db.prepare("INSERT INTO `localities` (localityId, countyId, name, postalCode) VALUES (?, ?, ?, ?)");
  const insertStreetQuery = db.prepare("INSERT INTO `streets` (streetId, localityId, name, postalCode) VALUES (?, ?, ?, ?)");
  const insertStreetNumberQuery = db.prepare("INSERT INTO `streetNumbers` (streetNumberId, streetId, name, postalCode) VALUES (?, ?, ?, ?)");
  const insertPostalCodeQuery = db.prepare("INSERT INTO `postalCodes` (postalCode, countyId, localityId, streetId, streetNumberId) VALUES (?, ?, ?, ?, ?)");
  
  db.serialize(() => {
    for (const countyName in counties) {
      const county = counties[countyName];
      const countyId = county.index;
      insertCountyQuery.run(countyId, countyName);

      for (const localityName in county.localities) {
        const locality = county.localities[localityName];
        const localityId = locality.index;
        insertLocalityQuery.run(localityId, countyId, localityName, locality.postalCode);

        if (locality.streets !== undefined) {
          for (const streetName in locality.streets) {
            const street = locality.streets[streetName];
            const streetId = street.index;
            insertStreetQuery.run(streetId, localityId, streetName, street.postalCode);

            if (street.numbers !== undefined) {
              for (const streetNumberName in street.numbers) {
                const streetNumber = street.numbers[streetNumberName];
                const streetNumberId = streetNumber.index;
                insertStreetNumberQuery.run(streetNumberId, streetId, streetNumberName, streetNumber.postalCode);
              }
            }
          }
        }
      }
    }

    for (const postalCodeName in postalCodes) {
      const postalCode = postalCodes[postalCodeName];

      insertPostalCodeQuery.run(
        postalCodeName,
        postalCode.countyId,
        postalCode.localityId,
        postalCode.streetId,
        postalCode.streetNumberId
      );
    }

    insertCountyQuery.finalize();
    insertLocalityQuery.finalize();
    insertStreetQuery.finalize();
    insertStreetNumberQuery.finalize();
    insertPostalCodeQuery.finalize();
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