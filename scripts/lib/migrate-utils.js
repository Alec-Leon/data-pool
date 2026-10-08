const fs = require("fs");
const path = require("path");

function slugify(name) {
  return String(name)
    .replace(/<[^>]+>/g, "")
    .trim()
    .toLowerCase()
    .replace(/[''`""«»]/g, "")
    .replace(/[^\wа-яё0-9]+/gi, "-")
    .replace(/ё/g, "е")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function cleanCell(raw) {
  return String(raw || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?[^>]+>/g, "")
    .trim();
}

function yamlEscape(str) {
  if (str === undefined || str === null || str === "") return '""';
  const s = String(str).replace(/\r\n/g, "\n");
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n")}"`;
}

function splitRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return null;
  const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  const cells = [];
  let current = "";
  for (let i = 0; i < inner.length; i++) {
    if (inner[i] === "|") {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += inner[i];
  }
  cells.push(current.trim());
  return cells;
}

function isSeparator(cells) {
  return cells.every((c) => /^[-:\s]+$/.test(c));
}

function normalizeHeader(h) {
  return h.toLowerCase().replace(/\s+/g, " ").trim();
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

function extractSectionsById(md) {
  const sectionRe = /<div[^>]*\bid="([^"]+)"[^>]*>/gi;
  const starts = [];
  let match;
  while ((match = sectionRe.exec(md)) !== null) {
    starts.push({ id: match[1], index: match.index });
  }
  return starts.map((s, i) => ({
    id: s.id,
    chunk: md.slice(s.index, i + 1 < starts.length ? starts[i + 1].index : md.length),
  }));
}

function yamlValue(value) {
  if (value === undefined || value === null || value === "") return null;
  if (Array.isArray(value)) {
    if (!value.length) return null;
    if (typeof value[0] === "object" && value[0] !== null) {
      return (
        "\n" +
        value
          .map((entry) => {
            const id = entry.id ?? entry;
            const label = entry.label ?? entry.id ?? entry;
            return `  - id: ${yamlEscape(String(id))}\n    label: ${yamlEscape(String(label))}`;
          })
          .join("\n")
      );
    }
    return `[${value.map((v) => yamlEscape(String(v))).join(", ")}]`;
  }
  if (typeof value === "object") {
    return yamlEscape(JSON.stringify(value));
  }
  return yamlEscape(value);
}

/** Normalize item categories: [{id, label}, ...] */
function normalizeCategories(data = {}) {
  const raw = data.categories;
  if (Array.isArray(raw) && raw.length) {
    return raw
      .map((entry) => {
        if (typeof entry === "string") {
          return {
            id: entry,
            label:
              (data.categoryLabels && data.categoryLabels[entry]) ||
              (entry === data.category ? data.categoryLabel : null) ||
              entry,
          };
        }
        if (entry && entry.id) {
          return {
            id: String(entry.id),
            label: String(entry.label || entry.id),
          };
        }
        return null;
      })
      .filter(Boolean);
  }
  if (data.category) {
    return [
      {
        id: String(data.category),
        label: String(data.categoryLabel || data.category),
      },
    ];
  }
  return [];
}

function writeItems(outDir, items) {
  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "items.11tydata.js"),
    "module.exports = {\n  layout: false,\n  permalink: false,\n};\n"
  );

  const used = new Map();
  let total = 0;
  for (const item of items) {
    let slug = item.slug || slugify(item.title) || `item-${total}`;
    if (used.has(slug)) {
      const n = used.get(slug) + 1;
      used.set(slug, n);
      slug = `${slug}-${n}`;
    } else {
      used.set(slug, 1);
    }

    const fields = { ...(item.fields || {}) };
    // Ensure categories list exists from primary category fields
    if (!fields.categories && fields.category) {
      fields.categories = [
        {
          id: fields.category,
          label: fields.categoryLabel || fields.category,
        },
      ];
    }

    const lines = ["---", `title: ${yamlEscape(item.title)}`, "permalink: false"];
    for (const [key, value] of Object.entries(fields)) {
      if (key === "title") continue;
      const rendered = yamlValue(value);
      if (rendered === null) continue;
      if (rendered.startsWith("\n")) {
        lines.push(`${key}:${rendered}`);
      } else {
        lines.push(`${key}: ${rendered}`);
      }
    }
    lines.push(`slug: ${slug}`, "---", "");
    const body = (item.body || "").trim();
    const content = lines.join("\n") + (body ? body + "\n" : "");
    fs.writeFileSync(path.join(outDir, `${slug}.md`), content, "utf8");
    total++;
  }
  return total;
}

function mapHeadersGeneric(headers, aliases) {
  const map = {};
  headers.forEach((h, i) => {
    const n = normalizeHeader(h);
    for (const [field, tests] of Object.entries(aliases)) {
      if (tests.some((t) => (typeof t === "string" ? n.includes(t) : t.test(n)))) {
        map[field] = i;
        break;
      }
    }
  });
  return map;
}

function getCell(row, map, key) {
  if (map[key] === undefined) return "";
  return cleanCell(row[map[key]] || "");
}

function isPlaceholder(value) {
  return !value || /^-+$/.test(value) || value === "-----------";
}

const AVAILABILITY_ALIASES = {
  дешевка: "Дешевка",
  дёшево: "Дешевка",
  дешево: "Дешевка",
  обычное: "Обычное",
  обычный: "Обычное",
  ценное: "Ценное",
  премиум: "Премиум",
  дорогое: "Дорогое",
  дорого: "Дорогое",
  дорогой: "Дорогое",
  "о.дорогое": "Очень дорогое",
  "о. дорогое": "Очень дорогое",
  "о дорогое": "Очень дорогое",
  "оч.дорогое": "Очень дорогое",
  "оч. дорогое": "Очень дорогое",
  "очень дорого": "Очень дорогое",
  "очень дорогое": "Очень дорогое",
  "супер роскошь": "Супер роскошь",
  "суперроскошь": "Супер роскошь",
  бесплатно: "Бесплатно",
};

function normalizeAvailability(raw) {
  if (!raw) return "";
  const key = String(raw)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\./g, ". "); // О.Дорогое → о. дорогое
  const compact = key.replace(/\. /g, ".");
  return (
    AVAILABILITY_ALIASES[key] ||
    AVAILABILITY_ALIASES[compact] ||
    String(raw).trim()
  );
}

function resolvePriceTemplates(str, priceTable = {}) {
  return String(str || "").replace(/\{\{\s*price\.(\w+)\s*\}\}/g, (_, key) => {
    return priceTable[key] || "";
  });
}

/**
 * Split "100eb (Премиум)" into { price, availability, priceNote }.
 * Complex / multi-tier strings stay in `price`, availability empty.
 */
function parsePrice(raw, priceTable = {}) {
  let text = resolvePriceTemplates(raw, priceTable);
  text = cleanCell(text)
    .replace(/\u00a0/g, " ")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return { price: "", availability: "", priceNote: "" };

  // 0 (Бесплатно) / 100eb (Премиум) / 11,600eb (Роскошь) / 500eb(Дорогое)
  const withAvail = text.match(
    /^([\d\s.,]+)\s*(eb|еЬ|еb|ed)?\s*[\(（]\s*([^\)）]+)\s*[\)）]\s*,?\s*(.*)$/i
  );
  if (withAvail) {
    const amount = withAvail[1].replace(/\s/g, "").replace(/,/g, "");
    const avail = normalizeAvailability(withAvail[3]);
    const note = (withAvail[4] || "").replace(/^,\s*/, "").trim();
    const isFree = amount === "0" || /бесплат/i.test(avail);
    return {
      price: isFree ? "0" : `${amount}eb`,
      availability: avail,
      priceNote: note,
    };
  }

  // Bare amount: 50eb / 20eb
  const bare = text.match(/^([\d\s.,]+)\s*(eb|еЬ|еb|ed)?\s*$/i);
  if (bare) {
    const amount = bare[1].replace(/\s/g, "").replace(/,/g, "");
    return {
      price: bare[2] || /eb/i.test(text) ? `${amount}eb` : amount,
      availability: "",
      priceNote: "",
    };
  }

  return { price: text, availability: "", priceNote: "" };
}

function peelSource(body, fallback = "") {
  let text = String(body || "");
  let source = fallback;
  const re = /\*?\s*Источник:\s*([^*\n]+)\s*\*?/gi;
  const match = re.exec(text);
  if (match) {
    source = match[1].trim();
    text = text.replace(/\n*\*?\s*Источник:\s*[^*\n]+\s*\*?/gi, "").trim();
  }
  return { source, body: text };
}

/** Short card blurb (~2 lines). Prefers first paragraph / sentence. */
function makeSummary(body, maxLen = 120) {
  let text = cleanCell(body)
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";

  // If first sentence is long enough for ~2 lines, use it
  const sentence = text.match(/^(.+?[.!?…])(?:\s|$)/);
  if (sentence && sentence[1].length >= 55 && sentence[1].length <= maxLen) {
    return sentence[1].trim();
  }

  // Otherwise take a chunk of the opening paragraph
  if (text.length <= maxLen) return text;

  const cut = text.slice(0, maxLen);
  const at = Math.max(cut.lastIndexOf(" "), cut.lastIndexOf(","));
  const base = (at > 40 ? cut.slice(0, at) : cut).trim();
  return `${base.replace(/[.,;:–—-]+$/, "")}…`;
}

function withPriceAndSource(fields, body, defaultSource, priceTable = {}) {
  const peeled = peelSource(body, defaultSource || fields.source || "");
  const parsed = parsePrice(fields.price || "", priceTable);
  const next = { ...fields };
  delete next.price;
  if (parsed.price) next.price = parsed.price;
  if (parsed.availability) next.availability = parsed.availability;
  if (parsed.priceNote) next.priceNote = parsed.priceNote;
  next.source = peeled.source || defaultSource || "Cyberpunk RED";
  if (!next.summary) {
    const summary = makeSummary(peeled.body);
    if (summary) next.summary = summary;
  }
  return { fields: next, body: peeled.body };
}

module.exports = {
  slugify,
  cleanCell,
  yamlEscape,
  splitRow,
  isSeparator,
  parseTables,
  extractSectionsById,
  writeItems,
  mapHeadersGeneric,
  getCell,
  isPlaceholder,
  normalizeHeader,
  parsePrice,
  peelSource,
  makeSummary,
  withPriceAndSource,
  normalizeAvailability,
  resolvePriceTemplates,
  normalizeCategories,
  yamlValue,
};
