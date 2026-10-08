const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pkg = require("./package.json");

const CATALOG_STAT_KEYS = [
  "skill",
  "damage",
  "magazine",
  "rof",
  "hands",
  "modSlots",
  "fits",
  "exot",
  "concealable",
  "features",
  "example",
  "price",
  "availability",
  "priceNote",
  "source",
  "summary",
  "sp",
  "bodyPart",
  "penalty",
  "style",
  "brand",
  "humanity",
  "install",
  "type",
  "stats",
  "exoskeleton",
  "shell",
  "weapons",
  "cyberware",
  "options",
];

function makeCatalogCollections(eleventyConfig, name, glob) {
  eleventyConfig.addCollection(name, (api) =>
    api.getFilteredByGlob(glob).sort((a, b) => {
      const orderA = Number(a.data.categoryOrder ?? 999);
      const orderB = Number(b.data.categoryOrder ?? 999);
      if (orderA !== orderB) return orderA - orderB;
      return String(a.data.title).localeCompare(String(b.data.title), "ru");
    })
  );

  eleventyConfig.addCollection(`${name}Categories`, (api) => {
    const items = api.getFilteredByGlob(glob);
    const map = new Map();

    for (const item of items) {
      const cats = normalizeItemCategories(item.data);
      for (const cat of cats) {
        if (!map.has(cat.id)) {
          map.set(cat.id, {
            id: cat.id,
            label: cat.label,
            group: item.data.group || null,
            groupLabel: item.data.groupLabel || null,
            order: Number(item.data.categoryOrder ?? 999),
            items: [],
          });
        } else if (cat.label && map.get(cat.id).label === cat.id) {
          map.get(cat.id).label = cat.label;
        }
        // Keep lowest order seen for this category id
        const entry = map.get(cat.id);
        const itemOrder = Number(item.data.categoryOrder ?? 999);
        if (itemOrder < entry.order) entry.order = itemOrder;
      }
    }

    return [...map.values()].sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return String(a.label).localeCompare(String(b.label), "ru");
    });
  });
}

function normalizeItemCategories(data = {}) {
  const raw = data.categories;
  const fromList = [];

  if (Array.isArray(raw) && raw.length) {
    for (const entry of raw) {
      if (typeof entry === "string") {
        fromList.push({
          id: entry,
          label:
            (data.categoryLabels && data.categoryLabels[entry]) ||
            (entry === data.category ? data.categoryLabel : null) ||
            entry,
        });
      } else if (entry && entry.id) {
        fromList.push({
          id: String(entry.id),
          label: String(entry.label || entry.id),
        });
      }
    }
  }

  // Old format is authoritative for the primary category.
  // If both exist, category/categoryLabel win; other categories[] entries stay as extras.
  if (data.category) {
    const primary = {
      id: String(data.category),
      label: String(data.categoryLabel || data.category),
    };
    const extras = fromList.filter((c) => c.id !== primary.id);
    return [primary, ...extras];
  }

  return fromList;
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "app-2.0/css": "css" });
  eleventyConfig.addPassthroughCopy({ "app-2.0/app": "app" });
  eleventyConfig.addPassthroughCopy({ images: "images" });
  eleventyConfig.addPassthroughCopy({ fonts: "fonts" });

  eleventyConfig.addGlobalData("version", `${pkg.version}-v2`);
  eleventyConfig.addGlobalData("siteTitle", "Data Pool 2.0");

  eleventyConfig.addFilter("catalogStats", (data) => {
    const out = {};
    for (const key of CATALOG_STAT_KEYS) {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        out[key] = data[key];
      }
    }
    return out;
  });

  eleventyConfig.addFilter("itemCategories", (data) =>
    normalizeItemCategories(data)
  );

  eleventyConfig.addFilter("itemCategoryIds", (data) =>
    normalizeItemCategories(data)
      .map((c) => c.id)
      .join(" ")
  );

  eleventyConfig.addFilter("itemCategoryLabels", (data) =>
    normalizeItemCategories(data)
      .map((c) => c.label)
      .join(" · ")
  );

  eleventyConfig.addFilter("catalogFilterValues", (collection, key) => {
    const set = new Set();
    for (const item of collection || []) {
      const raw = item?.data?.[key];
      if (raw === undefined || raw === null) continue;
      const value = String(raw).trim();
      if (value) set.add(value);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "ru"));
  });

  eleventyConfig.addFilter("catalogFilterLabel", (key) => {
    const labels = {
      skill: "Навык",
      damage: "Урон",
      magazine: "Магазин",
      rof: "ROF",
      hands: "Руки",
      modSlots: "Слоты модов",
      fits: "Подходит для",
      exot: "Тип оружия",
      concealable: "Скрыть",
      features: "Особенности",
      example: "Примеры",
      price: "Цена",
      availability: "Доступность",
      source: "Источник",
      sp: "ОС",
      bodyPart: "Часть тела",
      penalty: "Штрафы",
      style: "Стиль",
      brand: "Бренд",
      humanity: "ПЧ",
      install: "Установка",
      type: "Тип",
    };
    return labels[key] || key;
  });

  makeCatalogCollections(
    eleventyConfig,
    "weapons",
    "app-2.0/content/equipment/weapons/items/**/*.md"
  );
  makeCatalogCollections(
    eleventyConfig,
    "weaponsRange",
    "app-2.0/content/equipment/weapons/items/range/*.md"
  );
  makeCatalogCollections(
    eleventyConfig,
    "weaponsMelee",
    "app-2.0/content/equipment/weapons/items/melee/*.md"
  );
  makeCatalogCollections(
    eleventyConfig,
    "weaponsAmmo",
    "app-2.0/content/equipment/weapons/items/ammo/*.md"
  );
  makeCatalogCollections(
    eleventyConfig,
    "weaponsExplosives",
    "app-2.0/content/equipment/weapons/items/explosives/*.md"
  );
  makeCatalogCollections(
      eleventyConfig,
      "weaponsUpgrades",
      "app-2.0/content/equipment/weapons/items/upgrades/*.md"
  );
  makeCatalogCollections(
    eleventyConfig,
    "armor",
    "app-2.0/content/equipment/armor/items/*.md"
  );
  makeCatalogCollections(
    eleventyConfig,
    "gear",
    "app-2.0/content/equipment/items/items/*.md"
  );
  makeCatalogCollections(
    eleventyConfig,
    "agents",
    "app-2.0/content/equipment/agents/items/*.md"
  );
  makeCatalogCollections(
    eleventyConfig,
    "soft",
    "app-2.0/content/equipment/soft/items/*.md"
  );
  makeCatalogCollections(
    eleventyConfig,
    "acpa",
    "app-2.0/content/equipment/acpa/items/*.md"
  );

  eleventyConfig.setLibrary(
    "md",
    markdownIt({ html: true }).use(markdownItAnchor, {
      slugify: (s) =>
        s
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-а-яё]/gi, "")
          .replace(/ё/g, "е"),
    })
  );

  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/data-pool/app-2.0/",
    dir: {
      input: "app-2.0/content",
      includes: "../templates/includes",
      layouts: "../templates/layouts",
      output: "_site/app-2.0",
      data: "../data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html", "11ty.js"],
  };
};
