module.exports = function (eleventyConfig) {
  // src/assets/ → wwwroot/assets/
  eleventyConfig.addPassthroughCopy("assets");
  // src/files/ → wwwroot/files/
  eleventyConfig.addPassthroughCopy("files");

  return {
    dir: {
      input: "src",
      output: "wwwroot",
    },
  };
};
