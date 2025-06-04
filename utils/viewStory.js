module.exports = async function viewStory(page) {
  try {
    await page.waitForSelector('canvas[aria-label="Hikayeler"]', { timeout: 3000 });
    await page.click('canvas[aria-label="Hikayeler"]');
    await page.waitForTimeout(3000);
    return true;
  } catch {
    return false;
  }
};
