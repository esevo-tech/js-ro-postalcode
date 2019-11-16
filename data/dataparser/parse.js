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

  parseSmallLocalities(smallLocalitiesSheet);
  persist("counties.json", countiesMap);
}

function parseSmallLocalities(sheet) {
  let countyIndex = 0;
  let rowIndex = 2; // skip header row
  
  let countyAt = (index) => sheet["B" + index];
  let localityAt = (index) => sheet["C" + index];

  let countyCell = countyAt(rowIndex);
  while (countyCell != undefined) {
    const countyName = countyCell.v;
    const localityName = localityAt(rowIndex).v;

    obtainLocality(countyName, localityName);
    countyCell = countyAt(++rowIndex);
  }
}

function obtainCounty(countyName) {
  if (countiesMap[countyName] !== undefined) {
    return countiesMap[countyName];
  }

  const newCounty = {
    "index": numCounties++,
    "name": countyName,
    "localities": {}
  };

  countiesMap[countyName] = newCounty;
  return newCounty;
}

function obtainLocality(countyName, localityName) {
  const county = obtainCounty(countyName);

  if (county.localities[countyName] !== undefined) {
    return county.localities[countyName];
  }

  const newLocality = {
    "index": numLocalities++,
    "name": localityName
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