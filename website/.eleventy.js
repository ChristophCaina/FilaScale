const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const path = require("path");
const fs = require("fs");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);

  // Markdown config
  const md = markdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItAnchor, { permalink: markdownItAnchor.permalink.headerLink() });
  eleventyConfig.setLibrary("md", md);

  // Pass-through copies
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" });

  // Shortcode: active nav link
  eleventyConfig.addShortcode("activeLink", function (page, href) {
    return page.url.startsWith(href) ? ' aria-current="page"' : "";
  });

  // Filter: get translation string
  eleventyConfig.addFilter("t", function (key, translations) {
    return key.split(".").reduce((obj, k) => obj?.[k], translations) ?? key;
  });

  // Collection: docs per language
  eleventyConfig.addCollection("docs_de", (api) =>
    api.getFilteredByGlob("src/de/docs/**/*.md").sort((a, b) =>
      a.inputPath.localeCompare(b.inputPath)
    )
  );
  eleventyConfig.addCollection("docs_en", (api) =>
    api.getFilteredByGlob("src/en/docs/**/*.md").sort((a, b) =>
      a.inputPath.localeCompare(b.inputPath)
    )
  );

  return {
    pathPrefix: "/FilaScale/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
