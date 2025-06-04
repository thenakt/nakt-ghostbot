const fs = require("fs");
const path = "./interacted.json";

function loadInteracted() {
  return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
}

function saveInteracted(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = { loadInteracted, saveInteracted };
