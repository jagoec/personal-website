module.exports = function(eleventyConfig) {
  // Copy CSS from src/public directly to root of output
  eleventyConfig.addPassthroughCopy({
    "src/css/": "/"
  });

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
