const fs = require("fs");
const path = "./cookies.json";

async function saveCookies(page) {
  const cookies = await page.cookies();
  fs.writeFileSync(path, JSON.stringify(cookies, null, 2));
}

async function loadCookies(page) {
  if (!fs.existsSync(path)) return false;
  const cookies = JSON.parse(fs.readFileSync(path));
  await page.setCookie(...cookies);
  return true;
}

module.exports = { saveCookies, loadCookies };
