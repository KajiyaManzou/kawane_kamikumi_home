module.exports = function (eleventyConfig) {
  // 日本語日付フィルター（例: 2026年3月27日）
  eleventyConfig.addFilter("dateJa", function (date) {
    const d = new Date(date);
    return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
  });

  eleventyConfig.addFilter("dateMonthDayJa", function (date) {
    const d = new Date(date);
    return (d.getMonth() + 1) + "月" + d.getDate() + "日";
  });

  // src/assets/ → wwwroot/assets/
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  // src/files/ → wwwroot/files/
  eleventyConfig.addPassthroughCopy({ "src/files": "files" });

  // お知らせコレクション（日付降順）
  eleventyConfig.addCollection("notices", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/notices/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // 回覧板コレクション（日付降順）
  eleventyConfig.addCollection("circulars", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("content/circulars/*.md")
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: ".",
      includes: "src/_includes",
      data: "src/_data",
      output: "wwwroot",
    },
  };
};
