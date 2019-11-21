const fs = require("fs");

function getFileContents(path) {
  return fs.readFileSync(path).toString("utf8");
}

function loadJSON(path) {
  const file = getFileContents(path);
  return JSON.parse(file);
}

function deleteFile(path) {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
}

module.exports = {
  getFileContents,
  loadJSON,
  deleteFile
};