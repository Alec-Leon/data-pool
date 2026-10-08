#!/usr/bin/env node
/**
 * Parses content/equipment/weapons.md tables into individual MD files
 * under app-2.0/content/weapons/items/
 */
const fs = require("fs");
const path = require("path");
const {
  parsePrice,
  peelSource,
  makeSummary,
} = require("./lib/migrate-utils");

const priceTable = require("../data/price.json");
const SRC = path.join(__dirname, "../content/equipment/weapons.md");
const OUT = path.join(__dirname, "../app-2.0/content/equipment/weapons/items");

const CATEGORIES = {
  "weapons-odb-common": {
    id: "odb-common",
    label: "Обобщённое оружие дальнего боя",
    group: "common",
    order: 10,
    source: "Cyberpunk RED",
  },
  "weapons-obb-common": {
    id: "obb-common",
    label: "Обобщённое оружие ближнего боя",
    group: "common",
    order: 20,
    source: "Cyberpunk RED",
  },
  "weapons-unic-pistol": {
    id: "unic-pistol",
    label: "Пистолеты и ПП",
    group: "unic",
    groupLabel: "Оружие известных производителей",
    order: 30,
    source: "Black Chrome",
  },
  "weapons-unic-tactical": {
    id: "unic-tactical",
    label: "Тактическое",
    group: "unic",
    groupLabel: "Оружие известных производителей",
    order: 40,
    source: "Black Chrome",
  },
  "weapons-unic-bows": {
    id: "unic-bows",
    label: "Луки и арбалеты",
    group: "unic",
    groupLabel: "Оружие известных производителей",
    order: 50,
    source: "Black Chrome",
  },
  "weapons-unic-heavy": {
    id: "unic-heavy",
    label: "Оружие крупного калибра",
    group: "unic",
    groupLabel: "Оружие известных производителей",
    order: 60,
    source: "Black Chrome",
  },
  "pistol-exotic": {
    id: "exotic-pistol",
    label: "Экзотика: пистолеты и ПП",
    group: "exotic",
    groupLabel: "Экзотическое оружие дальнего боя",
    order: 70,
    source: "Black Chrome",
  },
  "tactical-exotic": {
    id: "exotic-tactical",
    label: "Экзотика: тактическое",
    group: "exotic",
    groupLabel: "Экзотическое оружие дальнего боя",
    order: 80,
    source: "Black Chrome",
  },
  "heavy-exotic": {
    id: "exotic-heavy",
    label: "Экзотика: крупный калибр",
    group: "exotic",
    groupLabel: "Экзотическое оружие дальнего боя",
    order: 90,
    source: "Black Chrome",
  },
  "bows-exotic": {
    id: "exotic-bows",
    label: "Экзотика: луки и арбалеты",
    group: "exotic",
    groupLabel: "Экзотическое оружие дальнего боя",
    order: 100,
    source: "Black Chrome",
  },
  "light-obb": {
    id: "obb-light",
    label: "Ближний бой: лёгкое",
    group: "obb-exotic",
    groupLabel: "Экзотическое оружие ближнего боя",
    order: 110,
    source: "Black Chrome",
  },
  "normal-obb": {
    id: "obb-medium",
    label: "Ближний бой: среднее",
    group: "obb-exotic",
    groupLabel: "Экзотическое оружие ближнего боя",
    order: 120,
    source: "Black Chrome",
  },
  "heavy-obb": {
    id: "obb-heavy",
    label: "Ближний бой: тяжёлое",
    group: "obb-exotic",
    groupLabel: "Экзотическое оружие ближнего боя",
    order: 130,
    source: "Black Chrome",
  },
  "very-heavy-obb": {
    id: "obb-very-heavy",
    label: "Ближний бой: очень тяжёлое",
    group: "obb-exotic",
    groupLabel: "Экзотическое оружие ближнего боя",
    order: 140,
    source: "Black Chrome",
  },
  "unic-obb": {
    id: "obb-unic",
    label: "Ближний бой: уникальное",
    group: "obb-exotic",
    groupLabel: "Экзотическое оружие ближнего боя",
    order: 150,
    source: "Black Chrome",
  },
  "weapons-thrown-exotic": {
    id: "thrown-exotic",
    label: "Экзотическое метательное",
    group: "thrown",
    order: 160,
    source: "Black Chrome",
  },
  "weapons-solo": {
    id: "solo",
    label: "Соло Удачи 2045",
    group: "solo",
    order: 170,
    source: "Соло Удачи 2045",
  },
  ammo: {
    id: "ammo",
    label: "Боеприпасы",
    group: "ammo",
    groupLabel: "Боеприпасы, гранаты, взрывчатка",
    order: 180,
    source: "Cyberpunk RED",
  },
  explosives: {
    id: "explosives",
    label: "Гранаты и взрывчатка",
    group: "ammo",
    groupLabel: "Боеприпасы, гранаты, взрывчатка",
    order: 190,
    source: "Cyberpunk RED",
  },
  "weapons-2077": {
    id: "weapons-2077",
    label: "Оружие 2070-х",
    group: "cp2077",
    order: 200,
    source: "Cyberpunk 2077",
  },
  "mods-77": {
    id: "mods-2077",
    label: "Модификации 2070-х",
    group: "cp2077",
    groupLabel: "2070-е: модификации и боеприпасы",
    order: 210,
    source: "Cyberpunk 2077",
  },
  "ammo-77": {
    id: "ammo-2077",
    label: "Боеприпасы 2070-х",
    group: "cp2077",
    groupLabel: "2070-е: модификации и боеприпасы",
    order: 220,
    source: "Cyberpunk 2077",
  },
  "weapons-mods": {
    id: "mods",
    label: "Модификации оружия",
    group: "mods",
    order: 25,
    source: "Black Chrome",
  },
};

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^\wа-яё0-9]+/gi, "-")
    .replace(/ё/g, "е")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function cleanCell(raw) {
  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\|/g, "\\|")
    .trim();
}

function splitRow(line) {
  // Markdown table rows: | cell | cell |
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return null;
  const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  const cells = [];
  let current = "";
  let i = 0;
  while (i < inner.length) {
    if (inner[i] === "|") {
      cells.push(current.trim());
      current = "";
      i++;
      continue;
    }
    current += inner[i];
    i++;
  }
  cells.push(current.trim());
  return cells;
}

function isSeparator(cells) {
  return cells.every((c) => /^[-:\s]+$/.test(c));
}

function normalizeHeader(h) {
  return h
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function mapHeaders(headers) {
  const map = {};
  headers.forEach((h, i) => {
    const n = normalizeHeader(h);
    if (n.includes("название") || n === "тип" || n.includes("имя")) map.name = i;
    else if (n.includes("пример")) map.example = i;
    else if (n.includes("навык")) map.skill = i;
    else if (n.includes("урон")) map.damage = i;
    else if (n.includes("магазин")) map.magazine = i;
    else if (n === "rof") map.rof = i;
    else if (n.includes("руки")) map.hands = i;
    else if (n.includes("слот")) map.modSlots = i;
    else if (n.includes("скрыть") || n.includes("скрыт")) map.concealable = i;
    else if (n.includes("особен")) map.features = i;
    else if (n.includes("описан") || n.includes("эффект") || n.includes("правил"))
      map.description = i;
    else if (n.includes("цена") || n.includes("стоим")) map.price = i;
    else if (n.includes("категор")) map.categoryHint = i;
    else map[`col${i}`] = i;
  });
  if (map.name === undefined) map.name = 0;
  return map;
}

function extractTablesBySection(md) {
  const sections = [];
  const sectionRe = /<div[^>]*\bid="([^"]+)"[^>]*>/gi;
  let match;
  const starts = [];
  while ((match = sectionRe.exec(md)) !== null) {
    starts.push({ id: match[1], index: match.index });
  }

  for (let s = 0; s < starts.length; s++) {
    const { id, index } = starts[s];
    if (!CATEGORIES[id]) continue;
    const end = s + 1 < starts.length ? starts[s + 1].index : md.length;
    const chunk = md.slice(index, end);
    sections.push({ id, chunk });
  }
  return sections;
}

function parseTables(chunk) {
  const lines = chunk.split("\n");
  const tables = [];
  let i = 0;
  while (i < lines.length) {
    const cells = splitRow(lines[i]);
    if (!cells || cells.length < 2) {
      i++;
      continue;
    }
    const next = i + 1 < lines.length ? splitRow(lines[i + 1]) : null;
    if (!next || !isSeparator(next)) {
      i++;
      continue;
    }
    const headers = cells;
    const rows = [];
    i += 2;
    while (i < lines.length) {
      const row = splitRow(lines[i]);
      if (!row) break;
      if (isSeparator(row)) {
        i++;
        continue;
      }
      if (row.every((c) => !c.trim())) {
        i++;
        continue;
      }
      rows.push(row);
      i++;
    }
    tables.push({ headers, rows });
  }
  return tables;
}

function yamlEscape(str) {
  if (str === undefined || str === null || str === "") return '""';
  const s = String(str).replace(/\r\n/g, "\n");
  // Always quote — plain YAML breaks on "-", ":", "#", etc.
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
}

function buildWeaponFile(item, cat, index) {
  const slug = slugify(item.name) || `weapon-${index}`;
  let body = item.description
    ? item.description.replace(/\\n/g, "\n").trim()
    : "";

  const peeled = peelSource(body, cat.source || "Cyberpunk RED");
  body = peeled.body;
  const parsed = parsePrice(item.price || "", priceTable);

  const fm = [
    "---",
    `title: ${yamlEscape(item.name)}`,
    `permalink: false`,
    `tags: weapons`,
    `category: ${cat.id}`,
    `categoryLabel: ${yamlEscape(cat.label)}`,
    // multi-filter support (primary = first)
    `categories:\n  - id: ${yamlEscape(cat.id)}\n    label: ${yamlEscape(cat.label)}`,
    `group: ${cat.group}`,
    cat.groupLabel ? `groupLabel: ${yamlEscape(cat.groupLabel)}` : null,
    `categoryOrder: ${cat.order}`,
    item.skill ? `skill: ${yamlEscape(item.skill)}` : null,
    item.damage ? `damage: ${yamlEscape(item.damage)}` : null,
    item.magazine ? `magazine: ${yamlEscape(item.magazine)}` : null,
    item.rof ? `rof: ${yamlEscape(item.rof)}` : null,
    item.hands ? `hands: ${yamlEscape(item.hands)}` : null,
    item.modSlots ? `modSlots: ${yamlEscape(item.modSlots)}` : null,
    item.concealable ? `concealable: ${yamlEscape(item.concealable)}` : null,
    item.features ? `features: ${yamlEscape(item.features)}` : null,
    item.example ? `example: ${yamlEscape(item.example)}` : null,
    parsed.price ? `price: ${yamlEscape(parsed.price)}` : null,
    parsed.availability
      ? `availability: ${yamlEscape(parsed.availability)}`
      : null,
    parsed.priceNote ? `priceNote: ${yamlEscape(parsed.priceNote)}` : null,
    `source: ${yamlEscape(peeled.source)}`,
    (() => {
      const summary = makeSummary(body);
      return summary ? `summary: ${yamlEscape(summary)}` : null;
    })(),
    `slug: ${slug}`,
    "---",
    "",
  ]
    .filter((l) => l !== null)
    .join("\n");

  return {
    slug,
    content: fm + (body ? body + "\n" : ""),
  };
}

function rowToItem(row, colMap) {
  const get = (key) => {
    if (colMap[key] === undefined) return "";
    return cleanCell(row[colMap[key]] || "");
  };
  const name = get("name");
  if (!name || name.startsWith("---")) return null;
  return {
    name,
    skill: get("skill"),
    damage: get("damage"),
    magazine: get("magazine"),
    rof: get("rof"),
    hands: get("hands"),
    modSlots: get("modSlots"),
    concealable: get("concealable"),
    features: get("features"),
    description: get("description"),
    price: get("price"),
    example: get("example"),
  };
}

function main() {
  const md = fs.readFileSync(SRC, "utf8");
  if (fs.existsSync(OUT)) {
    fs.rmSync(OUT, { recursive: true });
  }
  fs.mkdirSync(OUT, { recursive: true });

  const sections = extractTablesBySection(md);
  const usedSlugs = new Map();
  let total = 0;

  for (const { id, chunk } of sections) {
    const cat = CATEGORIES[id];
    const tables = parseTables(chunk);
    for (const table of tables) {
      const colMap = mapHeaders(table.headers);
      for (const row of table.rows) {
        const item = rowToItem(row, colMap);
        if (!item) continue;
        let { slug, content } = buildWeaponFile(item, cat, total);
        if (usedSlugs.has(slug)) {
          const n = usedSlugs.get(slug) + 1;
          usedSlugs.set(slug, n);
          slug = `${slug}-${n}`;
          content = content.replace(/^slug: .+$/m, `slug: ${slug}`);
        } else {
          usedSlugs.set(slug, 1);
        }
        fs.writeFileSync(path.join(OUT, `${slug}.md`), content, "utf8");
        total++;
      }
    }
  }

  console.log(`Migrated ${total} weapons into ${OUT}`);
}

main();
