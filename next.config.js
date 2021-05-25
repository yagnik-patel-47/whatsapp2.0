const withPwa = require("next-pwa");

module.exports = withPwa({
  pwa: {
    dest: "public",
    disable: process.env.NODE_ENV === "development",
    skipWaiting: true,
  },
  future: {
    webpack5: true,
  },
});
