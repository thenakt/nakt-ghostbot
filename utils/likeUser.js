module.exports = async function likeUser(page) {
  try {
    await page.waitForSelector('article a', { timeout: 5000 });
    const postLinks = await page.$$eval('article a', links =>
      links.map(link => link.href).slice(0, 1)
    );

    if (postLinks.length === 0) return false;

    await page.goto(postLinks[0], { waitUntil: 'networkidle2' });
    await page.waitForSelector('[aria-label="Beğen"]', { timeout: 5000 });
    await page.click('[aria-label="Beğen"]');
    return true;
  } catch {
    return false;
  }
};
