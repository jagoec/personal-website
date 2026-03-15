const markdown = require("markdown-it");
const markdownTableOfContents = require("markdown-it-table-of-contents");

module.exports = function(eleventyConfig) {
  // Configure markdown-it with table support
  let md = markdown({
    html: true,
    breaks: true,
    linkify: true
  });
  
  // Add markdown-it plugins
  md.use(markdownTableOfContents);
  
  eleventyConfig.setLibrary("md", md);

  // Copy CSS from src/css directly to root of output
  eleventyConfig.addPassthroughCopy({
    "src/css/": "/"
  });

  // Add filter to render markdown in templates
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
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
