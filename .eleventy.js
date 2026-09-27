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

  // Open external links in a new tab
  const defaultLinkRenderer = md.renderer.rules.link_open ||
    ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
  md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    const href = tokens[idx].attrGet('href') || '';
    if (href.startsWith('http')) {
      tokens[idx].attrSet('target', '_blank');
      tokens[idx].attrSet('rel', 'noopener noreferrer');
    }
    return defaultLinkRenderer(tokens, idx, options, env, self);
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

  // Copy images from blog posts
  eleventyConfig.addPassthroughCopy("src/blog/**/*.{jpg,jpeg,png,gif,webp}");

  // Copy robots.txt and og images
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/img/**/*");

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

  // Add ISO date filter for sitemap lastmod
  eleventyConfig.addFilter("isoDate", (date) => {
    const dateStr = date instanceof Date ? date.toISOString().slice(0, 10) : String(date).slice(0, 10);
    return DateTime.fromISO(dateStr).toISODate();
  });

  // Word/character count filters over visible page text
  const visibleText = (html) => {
    return html
      .replace(/&#(\d+);/g, (m, code) => String.fromCharCode(parseInt(code, 10)))
      .replace(/&#x([0-9a-fA-F]+);/g, (m, code) => String.fromCharCode(parseInt(code, 16)))
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };
  eleventyConfig.addFilter("wordCount", (html) => visibleText(html).split(" ").length);
  eleventyConfig.addFilter("charCount", (html) => visibleText(html).length);

  // Add collection for blog posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/blog/*.md").map(item => {
      if (!item.data.excerpt) {
        // Read the file and extract first paragraph
        const filePath = path.join(process.cwd(), item.inputPath);
        const content = fs.readFileSync(filePath, 'utf8');
        // Remove front matter
        const parts = content.split('---');
        const body = parts.length > 2 ? parts.slice(2).join('---').trim() : content;
        const paragraphs = body.split(/\n\n+/);
        const excerptPara = paragraphs[0] || '';
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
