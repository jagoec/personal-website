module.exports = function(eleventyConfig) {
  // Copy public directory (CSS, images, etc)
  eleventyConfig.addPassthroughCopy("src/public");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
