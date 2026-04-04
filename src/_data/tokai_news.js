const EleventyFetch = require("@11ty/eleventy-fetch");
const Parser = require("rss-parser");

const RSS_URL = "https://www.vill.tokai.ibaraki.jp/cgi-bin/feed.php?siteNew=1";

module.exports = async function () {
  const processedAt = new Date();
  const processedDateJa = (processedAt.getMonth() + 1) + "月" + processedAt.getDate() + "日";

  try {
    const xml = await EleventyFetch(RSS_URL, {
      duration: "1h",
      type: "text",
    });

    const parser = new Parser();
    const feed = await parser.parseString(xml);

    const items = feed.items.slice(0, 5).map((item) => {
      const d = item.date ? new Date(item.date) : null;
      const dateJa = d
        ? `${d.getMonth() + 1}月${d.getDate()}日`
        : "";
      return {
        title: item.title || "",
        link: item.link || "",
        dateJa,
      };
    });

    return {
      items,
      processedDateJa,
    };
  } catch (e) {
    console.warn("[tokai_news] RSS取得失敗:", e.message);
    return {
      items: [],
      processedDateJa,
    };
  }
};
