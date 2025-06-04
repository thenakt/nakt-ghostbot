module.exports = function randomDelay() {
  return 3000 + Math.floor(Math.random() * 4000); // 3-7 saniye arası beklet
};
