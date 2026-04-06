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
  // Use exact match for root language pages (/de/, /en/) to avoid matching all sub-pages.
  // Use startsWith for section pages (/de/docs/, etc.) so sub-pages keep the nav item active.
  eleventyConfig.addShortcode("activeLink", function (page, href) {
    const segments = href.split("/").filter(Boolean);
    const isRoot = segments.length === 1;
    const match = isRoot ? page.url === href : page.url.startsWith(href);
    return match ? ' aria-current="page"' : "";
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
