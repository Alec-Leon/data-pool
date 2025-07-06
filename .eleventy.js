const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("css");
    eleventyConfig.addPassthroughCopy("app");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("data");
    eleventyConfig.setLibrary("md", markdownIt({ html: true }).use(markdownItAnchor, {
        slugify: s =>
            s
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^\w\-а-яё]/gi, "")
                .replace(/ё/g, "е")
    }));
    return {
        pathPrefix: "/data-pool/",
        dir: {
            input: "content",
            includes: "../templates/includes",
            layouts: "../templates/layouts",
            output: "docs",
            data: "../data"
        }
    };
};
