const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

function loadFile(path) {
  const workbook = xlsx.readFile(path);

  for (const sheetName of workbook.SheetNames) {
    console.log(sheetName);
  }
  
  const bucharestSheet = workbook.Sheets[workbook.SheetNames[0]];
  const largeLocalitiesSheet = workbook.Sheets[workbook.SheetNames[1]];
  const smallLocalitiesSheet = workbook.Sheets[workbook.SheetNames[2]];

  countyMap = parseCounties(smallLocalitiesSheet);

  persist("counties.json", countyMap);
}

function parseCounties(sheet) {
  const countyMap = {};
  
  let countyIndex = 0;
  let rowIndex = 2; // skip header row
  let cellAt = (index) => sheet["B" + index];
  let cell = cellAt(rowIndex);
  while (cell != undefined) {
    const countyName = cell.v;

    if (countyMap[countyName] === undefined) {
      countyMap[countyName] = {
        "index": countyIndex++,
        "name": countyName,
      };
    }

    cell = cellAt(++rowIndex);
  }

  return countyMap;
}

function persist(name, data) {
  const outputPath = path.join("output", name);
  const serializedData = JSON.stringify(data, null, 4);
  fs.writeFile(outputPath, serializedData, "utf8", () => {});
}

loadFile("../dataset/infocod-cu-siruta-mai-2016.xls");