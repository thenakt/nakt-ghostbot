const fs = require("fs");

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollBox = document.querySelector("div[role='dialog'] .isgrP");
        const scrollHeight = scrollBox.scrollHeight;
        scrollBox.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - 100) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

async function getFollowersFromList(page, count) {
  const followers = await page.evaluate((count) => {
    const nodes = document.querySelectorAll("div[role='dialog'] a[href*='/']");
    return Array.from(nodes)
      .map(n => n.getAttribute("href").replace(/\//g, ""))
      .filter(Boolean)
      .slice(0, count);
  }, count);
  return followers;
}

async function likeUser(page) {
  const buttons = await page.$$('article section span svg[aria-label="Beğen" i]');
  if (buttons.length > 0) {
    await buttons[0].click();
    return true;
  }
  return false;
}

async function viewStory(page) {
  try {
    const hasStory = await page.$('canvas[height]');
    if (hasStory) {
      await hasStory.click();
      await page.waitForTimeout(5000);
      return true;
    }
  } catch (e) {}
  return false;
}

function randomDelay() {
  return Math.floor(Math.random() * 2000) + 12000; // 12–14 saniye
}

function loadInteracted() {
  if (!fs.existsSync('./interacted.json')) fs.writeFileSync('./interacted.json', '{}');
  return JSON.parse(fs.readFileSync('./interacted.json', 'utf-8'));
}

function saveInteracted(data) {
  fs.writeFileSync('./interacted.json', JSON.stringify(data, null, 2));
}

module.exports = {
  autoScroll,
  getFollowersFromList,
  likeUser,
  viewStory,
  randomDelay,
  loadInteracted,
  saveInteracted
};
