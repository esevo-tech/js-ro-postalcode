const fs = require("fs");

function loadJSON(path) {
  const file = fs.readFileSync(path).toString("utf8");
  return JSON.parse(file);
}

module.exports = {
  loadJSON
};