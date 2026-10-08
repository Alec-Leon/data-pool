#!/usr/bin/env node
/**
 * Migrates all equipment catalogs (except weapons — see migrate-weapons-v2.js)
 * into app-2.0/content/equipment/<section>/items/
 */
const fs = require("fs");
const path = require("path");
const {
  slugify,
  cleanCell,
  parseTables,
  extractSectionsById,
  writeItems,
  mapHeadersGeneric,
  getCell,
  isPlaceholder,
  withPriceAndSource,
} = require("./lib/migrate-utils");

const ROOT = path.join(__dirname, "..");
const CONTENT = path.join(ROOT, "content/equipment");
const OUT_ROOT = path.join(ROOT, "app-2.0/content/equipment");
const priceTable = require("../data/price.json");

function finalize(item, defaultSource) {
  const { fields, body } = withPriceAndSource(
    item.fields,
    item.body,
    defaultSource,
    priceTable
  );
  return { ...item, fields, body };
}

function migrateArmor() {
  const md = fs.readFileSync(path.join(CONTENT, "armor.md"), "utf8");
  const sections = extractSectionsById(md);
  const armorSection = sections.find((s) => s.id === "armor");
  if (!armorSection) throw new Error("armor tab not found");

  const aliases = {
    name: ["назван"],
    sp: ["ос"],
    bodyPart: ["часть"],
    penalty: ["штраф"],
    price: ["цена"],
    description: ["описан"],
    style: ["стил"],
  };

  const items = [];
  for (const table of parseTables(armorSection.chunk)) {
    const map = mapHeadersGeneric(table.headers, aliases);
    for (const row of table.rows) {
      const title = getCell(row, map, "name");
      if (!title) continue;
      const spRaw = getCell(row, map, "sp");
      const bodyPart = getCell(row, map, "bodyPart");
      const penalty = getCell(row, map, "penalty");
      const style = getCell(row, map, "style");

      items.push(
        finalize(
          {
            title,
            body: getCell(row, map, "description"),
            fields: {
              tags: "armor",
              category: "armor",
              categoryLabel: "Список защиты",
              categoryOrder: "10",
              sp: isPlaceholder(spRaw) || spRaw === "Нет" ? "" : spRaw,
              bodyPart: isPlaceholder(bodyPart) ? "" : bodyPart,
              penalty: penalty || "",
              price: getCell(row, map, "price"),
              style: isPlaceholder(style) ? "" : style,
            },
          },
          "Cyberpunk RED"
        )
      );
    }
  }

  console.log(`armor: ${writeItems(path.join(OUT_ROOT, "armor/items"), items)}`);
}

function migrateItems() {
  const md = fs.readFileSync(path.join(CONTENT, "items.md"), "utf8");
  const categories = {
    items: { id: "items", label: "Предметы", order: 10 },
    consumables: { id: "consumables", label: "Расходники", order: 20 },
  };

  const aliases = {
    name: ["назван"],
    description: ["описан"],
    price: ["цена"],
  };

  const items = [];
  for (const { id, chunk } of extractSectionsById(md)) {
    const cat = categories[id];
    if (!cat) continue;
    for (const table of parseTables(chunk)) {
      const map = mapHeadersGeneric(table.headers, aliases);
      for (const row of table.rows) {
        let nameRaw = row[map.name] || "";
        const anchorMatch = nameRaw.match(/id=["']([^"']+)["']/i);
        const anchorId = anchorMatch ? anchorMatch[1] : "";
        const title = cleanCell(nameRaw).split("\n")[0].trim();
        if (!title) continue;

        items.push(
          finalize(
            {
              title,
              body: getCell(row, map, "description"),
              fields: {
                tags: "gear",
                category: cat.id,
                categoryLabel: cat.label,
                categoryOrder: String(cat.order),
                price: getCell(row, map, "price"),
                anchorId,
              },
            },
            "Cyberpunk RED"
          )
        );
      }
    }
  }

  console.log(`items: ${writeItems(path.join(OUT_ROOT, "items/items"), items)}`);
}

function migrateAgents() {
  const md = fs.readFileSync(path.join(CONTENT, "agents_accessories.md"), "utf8");
  const aliases = {
    name: ["наименов", "назван"],
    description: ["описан"],
    price: ["цена"],
    humanity: ["пч"],
    install: ["установ"],
    type: ["тип"],
  };

  const typeMeta = {
    "Для взлома": { id: "hack", label: "Для взлома", order: 10 },
    Имплант: { id: "implant", label: "Импланты", order: 20 },
    Смартфон: { id: "smartphone", label: "Смартфоны", order: 30 },
  };

  const items = [];
  for (const table of parseTables(md)) {
    const map = mapHeadersGeneric(table.headers, aliases);
    if (map.name === undefined || map.description === undefined) continue;
    for (const row of table.rows) {
      const title = getCell(row, map, "name");
      if (!title) continue;
      const type = getCell(row, map, "type") || "Прочее";
      const meta = typeMeta[type] || {
        id: slugify(type) || "other",
        label: type,
        order: 90,
      };

      items.push(
        finalize(
          {
            title,
            body: getCell(row, map, "description"),
            fields: {
              tags: "agents",
              category: meta.id,
              categoryLabel: meta.label,
              categoryOrder: String(meta.order),
              price: getCell(row, map, "price"),
              humanity: getCell(row, map, "humanity"),
              install: getCell(row, map, "install"),
              type,
            },
          },
          "Cyberpunk RED"
        )
      );
    }
  }

  console.log(`agents: ${writeItems(path.join(OUT_ROOT, "agents/items"), items)}`);
}

function migrateSoft() {
  const md = fs.readFileSync(path.join(CONTENT, "soft.md"), "utf8");
  const aliases = {
    name: ["наименов", "назван"],
    brand: ["брэнд", "бренд", "разработ"],
    description: ["описан"],
    price: ["цена"],
  };

  const items = [];
  for (const table of parseTables(md)) {
    const map = mapHeadersGeneric(table.headers, aliases);
    if (map.name === undefined) continue;
    for (const row of table.rows) {
      let nameRaw = row[map.name] || "";
      const anchorMatch = nameRaw.match(/id=["']([^"']+)["']/i);
      const anchorId = anchorMatch ? anchorMatch[1] : "";
      const title = cleanCell(nameRaw).replace(/^\s+/, "").trim();
      if (!title) continue;
      const brand = getCell(row, map, "brand");
      const price = getCell(row, map, "price");
      const isFree = /^0\b|бесплат/i.test(price);
      const cat = isFree
        ? { id: "free", label: "Бесплатные", order: 10 }
        : { id: "paid", label: "Платные", order: 20 };

      items.push(
        finalize(
          {
            title,
            body: getCell(row, map, "description"),
            fields: {
              tags: "soft",
              category: cat.id,
              categoryLabel: cat.label,
              categoryOrder: String(cat.order),
              brand,
              price,
              anchorId,
            },
          },
          "Cyberpunk RED"
        )
      );
    }
  }

  console.log(`soft: ${writeItems(path.join(OUT_ROOT, "soft/items"), items)}`);
}

function migrateAcpaSuits() {
  const md = fs.readFileSync(path.join(CONTENT, "acpa.md"), "utf8");
  const detailsRe =
    /<details[^>]*>\s*<summary>([^<]+)<\/summary>([\s\S]*?)<\/details>/gi;
  const items = [];
  let match;
  while ((match = detailsRe.exec(md)) !== null) {
    const title = match[1].trim();
    const block = match[2];
    const imgMatch = block.match(/src="\{\{\s*'([^']+)'\s*\|\s*url\s*\}\}"/);
    const image = imgMatch ? imgMatch[1] : "";

    const text = cleanCell(
      block
        .replace(/<img[^>]*>/gi, "")
        .replace(/<\/?div[^>]*>/gi, "")
        .replace(/<\/?p[^>]*>/gi, "\n")
        .replace(/<\/?b>/gi, "**")
    );

    const priceMatch = text.match(/\*\*Цена:\*\*\s*([^\n*]+)/);
    const price = priceMatch ? priceMatch[1].trim() : "";

    const statsMatch =
      text.match(/\*\*\s*([\d.]+\s*ПЗ\s*[•·].*?)\s*\*\*/) ||
      text.match(/([\d.]+\s*ПЗ\s*[•·][^\n]+)/);

    const statsLine = statsMatch
      ? statsMatch[1].replace(/\*\*/g, "").trim()
      : "";

    const exoMatch = text.match(/\*\*Экзоскелет:\*\*\s*([^\n*]+)/);
    const shellMatch = text.match(/\*\*Оболочка:\*\*\s*([^\n*]+)/);
    const weaponsMatch = text.match(/\*\*Борт\.Оружие:\*\*\s*([^\n*]+)/);
    const cyberMatch = text.match(/\*\*Борт\.Киберимпланты:\*\*\s*([^\n*]+)/);

    let body = text
      .replace(/\*\*Цена:\*\*[^\n]+\n*/i, "")
      .replace(/\*\*Экзоскелет:\*\*[^\n]+\n*/gi, "")
      .replace(/\*\*Оболочка:\*\*[^\n]+\n*/gi, "")
      .replace(/\*\*Борт\.Оружие:\*\*[^\n]+\n*/gi, "")
      .replace(/\*\*Борт\.Киберимпланты:\*\*[^\n]+\n*/gi, "")
      .replace(/\*\*\s*[\d.]+\s*ПЗ[\s\S]*?\*\*/g, "")
      .replace(/^[\d.]+\s*ПЗ\s*[•·][^\n]+\n*/m, "")
      .trim();

    items.push(
      finalize(
        {
          title,
          body,
          fields: {
            tags: "acpa",
            category: "suits",
            categoryLabel: "Готовые варианты",
            categoryOrder: "10",
            price,
            stats: statsLine,
            exoskeleton: exoMatch ? exoMatch[1].trim() : "",
            shell: shellMatch ? shellMatch[1].trim() : "",
            weapons: weaponsMatch ? weaponsMatch[1].trim() : "",
            cyberware: cyberMatch ? cyberMatch[1].trim() : "",
            image,
          },
        },
        "Interface RED / ACPA"
      )
    );
  }

  console.log(
    `acpa suits: ${writeItems(path.join(OUT_ROOT, "acpa/items"), items)}`
  );
}

function main() {
  migrateArmor();
  migrateItems();
  migrateAgents();
  migrateSoft();
  migrateAcpaSuits();
}

main();
