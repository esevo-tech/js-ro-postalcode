const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

let countiesMap = {};
let postalCodeMap = {};

let numCounties = 0;
let numLocalities = 0;
let numStreets = 0;
let numStreetNumbers = 0;
let numPostalCodes = 0;

function loadFile(path) {
  const workbook = xlsx.readFile(path);

  const bucharestSheet = workbook.Sheets[workbook.SheetNames[0]];
  const largeLocalitiesSheet = workbook.Sheets[workbook.SheetNames[1]];
  const smallLocalitiesSheet = workbook.Sheets[workbook.SheetNames[2]];

  parseBucharest(bucharestSheet);
  parseLargeLocalities(largeLocalitiesSheet);
  parseSmallLocalities(smallLocalitiesSheet);

  persist("counties.json", countiesMap);
  persist("postal-codes.json", postalCodeMap);

  logStats();
}

function parseBucharest(sheet) {
  let rowIndex = 2; // skip header row

  let streetTypeAt = (index) => sheet["A" + index];
  let streetNameAt = (index) => sheet["B" + index];
  let streetNumberNameAt = (index) => sheet["C" + index];
  let postalCodeAt = (index) => sheet["D" + index];
  let sectorNameAt = (index) => sheet["E" + index];

  let streetCell = streetNameAt(rowIndex);
  while (streetCell !== undefined) {
    const streetType = streetTypeAt(rowIndex).v;
    const streetName = streetCell.v;
    const streetNumberName = streetNumberNameAt(rowIndex).v;
    const postalCode = postalCodeAt(rowIndex).v;
    const sectorName = sectorNameAt(rowIndex).v;
    const countyName = "București";
    const localityName = `${countyName} Sector ${sectorName}`;

    const street = obtainStreet(countyName, localityName, streetName);
    street.type = streetType;

    // Streets which have a single postal code.
    if (isEmpty(streetNumberName)) {
      street.postalCode = parsePostalCode(postalCode);
      registerPostalCode(postalCode, countyName, localityName, streetName);
    } else {
      const streetNumber = obtainStreetNumber(countyName, localityName, streetName, streetNumberName);
      streetNumber.postalCode = parsePostalCode(postalCode);
      registerPostalCode(postalCode, countyName, localityName, streetName, streetNumberName);
    }

    streetCell = streetNameAt(++rowIndex);
  }
}

function parseLargeLocalities(sheet) {
  let rowIndex = 2; // skip header row

  let countyAt = (index) => sheet["A" + index];
  let localityAt = (index) => sheet["B" + index];
  let streetTypeAt = (index) => sheet["C" + index];
  let streetNameAt = (index) => sheet["D" + index];
  let streetNumberAt = (index) => sheet["E" + index];
  let postalCodeAt = (index) => sheet["F" + index];
  
  let countyCell = countyAt(rowIndex);
  while (countyCell !== undefined) {
    const countyName = countyCell.v;
    const localityName = localityAt(rowIndex).v;
    const streetType = streetTypeAt(rowIndex).v;
    const streetName = streetNameAt(rowIndex).v;
    const streetNumberName = streetNumberAt(rowIndex).v;
    const postalCode = postalCodeAt(rowIndex).v;
    
    const street = obtainStreet(countyName, localityName, streetName);
    street.type = streetType;

    // Streets which have a single postal code.
    if (isEmpty(streetNumberName)) {
      street.postalCode = parsePostalCode(postalCode);
      registerPostalCode(postalCode, countyName, localityName, streetName);
    } else {
      const streetNumber = obtainStreetNumber(countyName, localityName, streetName, streetNumberName);
      streetNumber.postalCode = parsePostalCode(postalCode);
      registerPostalCode(postalCode, countyName, localityName, streetName, streetNumberName);
    }

    countyCell = countyAt(++rowIndex);
  }
}

function parseSmallLocalities(sheet) {
  let rowIndex = 2; // skip header row
  
  let countyAt = (index) => sheet["B" + index];
  let localityAt = (index) => sheet["C" + index];
  let postalCodeAt = (index) => sheet["D" + index];

  let countyCell = countyAt(rowIndex);
  while (countyCell !== undefined) {
    const countyName = countyCell.v;
    const localityName = localityAt(rowIndex).v;
    const postalCode = postalCodeAt(rowIndex).v;

    const locality = obtainLocality(countyName, localityName);
    locality.postalCode = parsePostalCode(postalCode);
    registerPostalCode(postalCode, countyName, localityName);

    countyCell = countyAt(++rowIndex);
  }
}

function parsePostalCode(postalCode) {
  return parseInt(postalCode, 10);
}

function obtainCounty(countyName) {
  if (countiesMap[countyName] !== undefined) {
    return countiesMap[countyName];
  }

  const newCounty = {
    "index": numCounties++,
    "localities": {}
  };

  countiesMap[countyName] = newCounty;
  return newCounty;
}

function obtainLocality(countyName, localityName) {
  const county = obtainCounty(countyName);

  if (county.localities[localityName] !== undefined) {
    return county.localities[localityName];
  }

  const newLocality = {
    "index": numLocalities++
  };

  county.localities[localityName] = newLocality;
  return newLocality;
}

function obtainStreet(countyName, localityName, streetName) {
  const locality = obtainLocality(countyName, localityName);

  if (locality.streets === undefined) {
    locality.streets = {};
  }

  if (locality.streets[streetName] !== undefined) {
    return locality.streets[streetName];
  }

  const newStreet = {
    "index": numStreets++
  };

  locality.streets[streetName] = newStreet;
  return newStreet;
}

function obtainStreetNumber(countyName, localityName, streetName, streetNumberName) {
  const street = obtainStreet(countyName, localityName, streetName);

  if (street.numbers === undefined) {
    street.numbers = {};
  }

  if (street.numbers[streetNumberName] !== undefined) {
    return street.numbers[streetNumberName];
  }

  const newStreetNumber = {
    "index": numStreetNumbers++
  }

  street.numbers[streetNumberName] = newStreetNumber;
  return newStreetNumber;
}

function registerPostalCode(postalCode, countyName, localityName, streetName, streetNumberName) {
  let newPostalCode = {};
  postalCodeMap[postalCode] = newPostalCode;
  numPostalCodes++;

  if (countyName == undefined) return newPostalCode;
  const county = obtainCounty(countyName);
  newPostalCode.countyId = county.index;

  if (localityName == undefined) return newPostalCode;
  const locality = obtainLocality(countyName, localityName);
  newPostalCode.localityId = locality.index;

  if (streetName == undefined) return newPostalCode;
  const street = obtainStreet(countyName, localityName, streetName);
  newPostalCode.streetId = street.index;

  if (streetNumberName == undefined) return newPostalCode;
  const streetNumber = obtainStreetNumber(countyName, localityName, streetName, streetNumberName);
  newPostalCode.streetNumberId = streetNumber.index;

  return newPostalCode;
}

function logStats() {
  console.log(`Num. of counties: ${numCounties}.`);
  console.log(`Num. of localities: ${numLocalities}.`);
  console.log(`Num. of streets: ${numStreets}.`);
  console.log(`Num. of street numbers: ${numStreetNumbers}.`);
  console.log(`Num. of postal codes: ${numPostalCodes}.`);
}

function persist(name, data) {
  const outputPath = path.join("output", name);
  const serializedData = JSON.stringify(data, null, 4);
  fs.writeFile(outputPath, serializedData, "utf8", () => {});
}

function isEmpty(text) {
  return (text !== undefined && text !== null && text.trim().length == 0);
}

loadFile("../dataset/infocod-cu-siruta-mai-2016.xls");