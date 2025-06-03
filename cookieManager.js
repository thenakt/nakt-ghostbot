const fs = require('fs');
const path = './cookies.json';

async function saveCookies(page) {
  const cookies = await page.cookies();
  fs.writeFileSync(path, JSON.stringify(cookies, null, 2));
  console.log("🍪 Cookie kaydedildi.");
}

async function loadCookies(page) {
  if (fs.existsSync(path)) {
    const cookies = JSON.parse(fs.readFileSync(path));
    await page.setCookie(...cookies);
    console.log("🍪 Cookie yüklendi.");
    return true;
  }
  return false;
}

module.exports = { saveCookies, loadCookies };
