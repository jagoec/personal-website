const markdown = require("markdown-it");
const fs = require("fs");
const path = require("path");
const { DateTime } = require('luxon');

module.exports = function(eleventyConfig) {
  // Configure markdown-it with table support
  let md = markdown({
    html: true,
    breaks: true,
    linkify: true
  });
  
  // Add markdown-it plugins
  // md.use(markdownTableOfContents); // Removed as not used
  
  // Custom image renderer to add title attribute for tooltips
  const defaultImageRenderer = md.renderer.rules.image;
  md.renderer.rules.image = function(tokens, idx, options, env, self) {
    const token = tokens[idx];
    const alt = token.content;
    // Add title attribute with the alt text for hover tooltip
    token.attrSet('title', alt);
    return defaultImageRenderer(tokens, idx, options, env, self);
  };

  eleventyConfig.setLibrary("md", md);

  // Image optimization
  eleventyConfig.addShortcode("image", async function(src, alt, sizes = "100vw") {
    if(alt === undefined) {
      throw new Error(`Missing \`alt\` on responsiveimage from: ${src}`);
    }

    let metadata = await Image(src, {
      widths: [300, 600, 900],
      formats: ["webp", "jpeg"],
      outputDir: "./_site/img/",
      urlPath: "/img/"
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  });

  // Copy CSS from src/css directly to root of output
  eleventyConfig.addPassthroughCopy({
    "src/css/": "/"
  });

  // Copy images from garden posts
  eleventyConfig.addPassthroughCopy("src/garden/**/*.{jpg,jpeg,png,gif,webp}");

  // Add filter to render markdown in templates
  eleventyConfig.addFilter("markdown", (content) => {
    return md.render(content);
  });

  // Add date filter
  eleventyConfig.addFilter("readableDate", (date) => {
    let dt;
    if (date instanceof Date) {
      // Interpret the date as Eastern Time
      const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
      dt = DateTime.fromISO(dateStr, { zone: 'America/New_York' });
    } else if (typeof date === 'string') {
      dt = DateTime.fromISO(date, { zone: 'America/New_York' });
    } else {
      return date;
    }
    return dt.toFormat('MMMM d, yyyy');
  });

  // Add collection for garden posts
  eleventyConfig.addCollection("garden", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/garden/*.md").map(item => {
      if (!item.data.excerpt) {
        // Read the file and extract first paragraph
        const filePath = path.join(process.cwd(), item.inputPath);
        const content = fs.readFileSync(filePath, 'utf8');
        // Remove front matter
        const parts = content.split('---');
        const body = parts.length > 2 ? parts.slice(2).join('---').trim() : content;
        const paragraphs = body.split(/\n\n+/);
        // Assume structure: heading, date, content
        const excerptPara = paragraphs[2] || paragraphs[1] || paragraphs[0] || '';
        item.data.excerpt = excerptPara.trim();
      }
      return item;
    }).sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
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
