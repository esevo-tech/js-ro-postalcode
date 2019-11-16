const xlsx = require("xlsx");
const fs = require("fs");

function loadFile(path) {
  const workbook = xlsx.readFile(path);

  for (const sheetName of workbook.SheetNames) {
    console.log(sheetName);
  }
  
  const bucharestSheet = workbook.Sheets[workbook.SheetNames[0]];
  const largeLocalitiesSheet = workbook.Sheets[workbook.SheetNames[1]];
  const smallLocalitiesSheet = workbook.Sheets[workbook.SheetNames[2]];

  countyMap = parseCounties(smallLocalitiesSheet);
}

function parseCounties(sheet) {
  const countyMap = {};
  
  let rowIndex = 1;
  let cellAt = (index) => sheet["B" + index];
  let cell = cellAt(rowIndex);
  while (cell != undefined) {
    const countyName = cell.v;

    if (countyMap[countyName] === undefined) {
      countyMap[countyName] = {
        "name": countyName
      };
    }

    cell = cellAt(++rowIndex);
  }

  return countyMap;
}

loadFile("../dataset/infocod-cu-siruta-mai-2016.xls");