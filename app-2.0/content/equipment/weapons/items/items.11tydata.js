module.exports = {
  layout: false,
  permalink: false,
  eleventyComputed: {
    // New hand-written items often omit slug; without it every modal
    // resolves to the same template id (item-tpl-) and leaks stats like brand.
    slug: (data) => data.slug || data.page.fileSlug,
  },
};
