module.exports = async function getFollowersFromList(page, maxCount = 50) {
  await page.waitForSelector('._aano');
  const followers = await page.$$eval('._aano a[href]', (links, max) =>
    links
      .map(link => link.getAttribute('href'))
      .filter(href => href && href.startsWith('/') && !href.includes('/explore/'))
      .slice(0, max)
      .map(href => href.replace(/\//g, '')),
    maxCount
  );
  return followers;
};
