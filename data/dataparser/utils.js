const fs = require("fs");

function loadJSON(path) {
  const file = fs.readFileSync(path).toString("utf8");
  return JSON.parse(file);
}

function deleteFile(path) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

module.exports = {
  loadJSON,
  deleteFile
};