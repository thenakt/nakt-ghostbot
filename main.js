const fs = require("fs");
const puppeteer = require("puppeteer");
const targets = JSON.parse(fs.readFileSync("./targetAccounts.json", "utf-8"));

const {
  autoScroll,
  getFollowersFromList,
  likeUser,
  viewStory,
  randomDelay,
  loadInteracted,
  saveInteracted
} = require("./utils");

const { saveCookies, loadCookies } = require("./utils/cookieManager");

const DAILY_LIMIT = 6000;
let processed = 0;
const interacted = loadInteracted();

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // sunucu için zorunlu
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto("https://www.instagram.com/", { waitUntil: "networkidle2" });

  const isLoggedIn = await loadCookies(page);
  if (!isLoggedIn) {
    console.log("🔐 Otomatik giriş başarısız. Lütfen ilk çalıştırmada manuel giriş yapıp cookie kaydet.");
    await browser.close();
    return;
  }

  for (const { username, limit } of targets) {
    if (processed >= DAILY_LIMIT) break;

    console.log(`➡️ @${username} takipçileri işleniyor...`);
    await page.goto(`https://www.instagram.com/${username}/followers/`, {
      waitUntil: "networkidle2"
    });
    await autoScroll(page);

    const followers = await getFollowersFromList(page, Math.min(limit, DAILY_LIMIT - processed));

    for (const user of followers) {
      if (processed >= DAILY_LIMIT) break;
      if (interacted[user]?.liked && interacted[user]?.storyViewed) continue;

      try {
        await page.goto(`https://www.instagram.com/${user}/`, {
          waitUntil: "networkidle2"
        });
        await page.waitForTimeout(2000);

        let liked = interacted[user]?.liked || false;
        let storyViewed = interacted[user]?.storyViewed || false;

        if (!liked) liked = await likeUser(page);
        if (!storyViewed) storyViewed = await viewStory(page);

        interacted[user] = { liked, storyViewed };
        processed++;
        console.log(`✅ ${processed}/6000 - ${user} → ❤️:${liked} 👁:${storyViewed}`);
        saveInteracted(interacted);
        await page.waitForTimeout(randomDelay());
      } catch (e) {
        console.error(`❌ ${user} için hata: ${e.message}`);
      }
    }
  }

  await browser.close();
})();
