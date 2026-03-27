const QRCode = require("qrcode");

const SITE_URL = "https://kawanekamikumihome.kajiya-coffee.workers.dev/";

module.exports = async function () {
  const svg = await QRCode.toString(SITE_URL, {
    type: "svg",
    margin: 1,
    width: 120,
  });
  return { svg };
};
