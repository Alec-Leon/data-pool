#!/usr/bin/env node
/**
 * Sync category / categoryLabel → categories[] for all catalog items.
 *
 * Old format stays valid at runtime, but this keeps the YAML blocks aligned
 * so manual edits to category/categoryLabel are not shadowed by a stale
 * categories: list.
 *
 * DANGER: rewrites every matching .md via gray-matter and can destroy
 * hand-edited YAML formatting/comments/ordering. Prefer fixing runtime
 * category resolution instead of bulk-rewriting content.
 *
 * Usage (requires --force):
 *   node scripts/sync-categories-v2.js --force
 *   node scripts/sync-categories-v2.js --force app-2.0/content/equipment/armor/items
 */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { yamlEscape } = require("./lib/migrate-utils");

const ROOT = path.join(__dirname, "../app-2.0/content/equipment");
const DEFAULT_DIRS = [
  "weapons/items",
  "armor/items",
  "items/items",
  "agents/items",
  "soft/items",
  "acpa/items",
];

function normalizeFromData(data) {
  const list = [];
  if (Array.isArray(data.categories)) {
    for (const entry of data.categories) {
      if (typeof entry === "string") {
        list.push({ id: entry, label: entry });
      } else if (entry && entry.id) {
        list.push({
          id: String(entry.id),
          label: String(entry.label || entry.id),
        });
      }
    }
  }

  if (data.category) {
    const primary = {
      id: String(data.category),
      label: String(data.categoryLabel || data.category),
    };
    const extras = list.filter((c) => c.id !== primary.id);
    return [primary, ...extras];
  }
  return list;
}

function dumpCategories(cats) {
  if (!cats.length) return null;
  return (
    "categories:\n" +
    cats
      .map(
        (c) =>
          `  - id: ${yamlEscape(c.id)}\n    label: ${yamlEscape(c.label)}`
      )
      .join("\n")
  );
}

function rewriteFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const cats = normalizeFromData(parsed.data);
  if (!cats.length) return false;

  const data = { ...parsed.data };
  data.category = cats[0].id;
  data.categoryLabel = cats[0].label;
  data.categories = cats;

  // Rebuild front matter conservatively: keep key order-ish via gray-matter stringify
  const next = matter.stringify(parsed.content.replace(/^\n+/, ""), data, {
    lineWidth: -1,
  });

  // gray-matter may emit categories as JSON-ish; force block list for readability
  const forced = next.replace(
    /^categories:[\s\S]*?(?=^[a-zA-Z_][a-zA-Z0-9_]*:|^---\s*$)/m,
    dumpCategories(cats) + "\n"
  );

  if (forced !== raw) {
    fs.writeFileSync(filePath, forced, "utf8");
    return true;
  }
  return false;
}

function collectMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const pathArgs = args.filter((a) => a !== "--force");

  if (!force) {
    console.error(
      "Refusing to rewrite catalog items without --force.\n" +
        "This script overwrites .md front matter and can wipe local hand-edits.\n" +
        "Prefer runtime category normalization in .eleventy.app-2.0.js.\n" +
        "If you really need it: node scripts/sync-categories-v2.js --force [dir]"
    );
    process.exit(1);
  }

  const dirs = pathArgs.length
    ? pathArgs.map((a) => path.resolve(a))
    : DEFAULT_DIRS.map((d) => path.join(ROOT, d));

  let changed = 0;
  let total = 0;
  for (const dir of dirs) {
    const files = collectMarkdownFiles(dir);
    for (const file of files) {
      total++;
      if (rewriteFile(file)) changed++;
    }
  }
  console.log(`Synced categories in ${changed}/${total} files`);
}

main();
