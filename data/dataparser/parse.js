const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

let countiesMap = {};
let numCounties = 0;
let numLocalities = 0;

function loadFile(path) {
  const workbook = xlsx.readFile(path);

  for (const sheetName of workbook.SheetNames) {
    console.log(sheetName);
  }
  
  const bucharestSheet = workbook.Sheets[workbook.SheetNames[0]];
  const largeLocalitiesSheet = workbook.Sheets[workbook.SheetNames[1]];
  const smallLocalitiesSheet = workbook.Sheets[workbook.SheetNames[2]];

  //parseSmallLocalities(smallLocalitiesSheet);
  parseLargeLocalities(largeLocalitiesSheet);
  persist("counties.json", countiesMap);
}

function parseLargeLocalities(sheet) {
  let rowIndex = 2; // skip header row

  let countyAt = (index) => sheet["A" + index];
  let localityAt = (index) => sheet["B" + index];

  let countyCell = countyAt(rowIndex);
  while (countyCell !== undefined) {
    const countyName = countyCell.v;
    const localityName = localityAt(rowIndex).v;

    obtainLocality(countyName, localityName);

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
    locality.postalCode = postalCode;

    countyCell = countyAt(++rowIndex);
  }
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
    return county.localities[countyName];
  }

  const newLocality = {
    "index": numLocalities++
  };

  county.localities[localityName] = newLocality;
  return newLocality;
}

function persist(name, data) {
  const outputPath = path.join("output", name);
  const serializedData = JSON.stringify(data, null, 4);
  fs.writeFile(outputPath, serializedData, "utf8", () => {});
}

loadFile("../dataset/infocod-cu-siruta-mai-2016.xls");