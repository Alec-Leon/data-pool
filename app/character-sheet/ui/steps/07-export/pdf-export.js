const PDF_TEMPLATE_PATH =
    "app/character-sheet/ui/steps/07-export/character-sheet-template.pdf";

function templateUrl() {
    const base = window.__BASE_PATH__ || "/";
    return `${base}${PDF_TEMPLATE_PATH}`;
}

function pdfLibModuleUrl() {
    const base = window.__BASE_PATH__ || "/";
    return `${base}node_modules/pdf-lib/dist/pdf-lib.esm.min.js`;
}

function safeFileName(name) {
    const raw = (name || "").trim() || "datapool-default-charlist";
    const safe = raw.replace(/[/\\:*?"<>|]/g, "_").replace(/\s+/g, " ").trim();
    return `${safe || "datapool-default-charlist"}.pdf`;
}

function parseTrailingNumber(id) {
    const m = String(id).match(/^(.+?)(\d+)$/);
    if (!m) return null;
    return { prefix: m[1], n: parseInt(m[2], 10) };
}

function expandTextFieldRange(startId, endId) {
    const a = parseTrailingNumber(startId);
    const b = parseTrailingNumber(endId);
    if (!a || !b || a.prefix !== b.prefix) return [];
    const out = [];
    for (let k = a.n; k <= b.n; k++) out.push(a.prefix + k);
    return out;
}

function safeSetText(form, fieldName, value) {
    if (!fieldName || !form) return;
    const t = String(value ?? "");
    try {
        form.getTextField(fieldName).setText(t);
        return;
    } catch {
        /* не текстовое поле */
    }
    try {
        const dd = form.getDropdown(fieldName);
        const opts = dd.getOptions();
        if (opts.includes(t)) {
            dd.select(t);
        }
    } catch {
        /* не выпадающий список */
    }
}

function safeCheck(form, fieldName, checked) {
    if (!fieldName || !form) return;
    try {
        const cb = form.getCheckBox(fieldName);
        if (checked) cb.check();
        else cb.uncheck();
    } catch {
        /* нет чекбокса */
    }
}

function fillRangeParallel(form, nameStart, nameEnd, noteStart, noteEnd, items) {
    if (!nameStart || !nameEnd || !noteStart || !noteEnd) return;
    const nameIds = expandTextFieldRange(nameStart, nameEnd);
    const noteIds = expandTextFieldRange(noteStart, noteEnd);
    const list = Array.isArray(items) ? items : [];
    const n = Math.min(nameIds.length, noteIds.length, list.length);
    for (let i = 0; i < n; i++) {
        const row = list[i] || {};
        safeSetText(form, nameIds[i], row.name ?? "");
        safeSetText(form, noteIds[i], row.desc ?? "");
    }
}

function scalarSkillVal(raw) {
    if (raw === undefined || raw === null) return "";
    if (Array.isArray(raw)) return "";
    return String(raw);
}

function fillSkillEntry(form, spec, raw, skillKey) {
    if (typeof spec === "string") {
        safeSetText(form, spec, scalarSkillVal(raw));
        return;
    }
    if (!spec || typeof spec !== "object") return;

    const arr = Array.isArray(raw) ? raw : [];

    if (skillKey === "language") {
        const street = spec["language-skill-street"];
        if (street?.level) safeSetText(form, street.level, arr[0]?.level ?? "");
        for (let i = 1; i <= 2; i++) {
            const sub = spec[`language-skill-${i}`];
            const row = arr[i];
            if (!sub) continue;
            if (sub.name) safeSetText(form, sub.name, row?.name ?? "");
            if (sub.level) safeSetText(form, sub.level, row?.level ?? "");
        }
        return;
    }

    const multiKeys = Object.keys(spec)
        .filter(k => /skill-\d+$/.test(k))
        .sort((x, y) => {
            const nx = parseInt(x.replace(/^.*-(\d+)$/, "$1"), 10);
            const ny = parseInt(y.replace(/^.*-(\d+)$/, "$1"), 10);
            return nx - ny;
        });
    multiKeys.forEach((mk, idx) => {
        const sub = spec[mk];
        const row = arr[idx];
        if (!sub || typeof sub !== "object" || !row) return;
        if (sub.name) safeSetText(form, sub.name, row.name ?? "");
        if (sub.level) safeSetText(form, sub.level, row.level ?? "");
    });
}

function fillAllSkills(form, state) {
    const keys = window.PDF_EXPORT_KEYS?.skills;
    if (!keys || typeof SKILL_GROUPS === "undefined") return;
    for (const [groupKey, skillKeys] of Object.entries(SKILL_GROUPS)) {
        const g = state.skills?.[groupKey] || {};
        for (const skillKey of skillKeys) {
            const spec = keys[skillKey];
            if (spec === undefined) continue;
            fillSkillEntry(form, spec, g[skillKey], skillKey);
        }
    }
}

function fillMainAndStats(form, state) {
    const K = window.PDF_EXPORT_KEYS;
    if (!K?.main || !K.stats) return;
    const main = K.main;
    const roles = window.DataPool.ROLES || {};
    const roleLabel = roles[state.role]?.label ?? state.role ?? "";
    if (main.name) safeSetText(form, main.name, state.name ?? "");
    if (main.role && typeof main.role === "object") {
        const r = main.role;
        if (r.name) safeSetText(form, r.name, roleLabel);
        if (r["role-skill"] !== undefined) {
            safeSetText(form, r["role-skill"], "");
        }
        if (r["role-level"] !== undefined) {
            safeSetText(form, r["role-level"], state.roleLevel ?? "");
        }
    }
    const hp = main.hp;
    if (hp) {
        const h = state.stats?.hp ?? "";
        if (hp["hp-actual"]) safeSetText(form, hp["hp-actual"], h);
        if (hp["hp-max"]) safeSetText(form, hp["hp-max"], h);
    }
    const hum = main.humanity;
    if (hum) {
        const hm = state.stats?.humanity ?? "";
        if (hum["humanity-actual"]) safeSetText(form, hum["humanity-actual"], hm);
        if (hum["humanity-max"]) safeSetText(form, hum["humanity-max"], hm);
    }
    if (main.wound) safeSetText(form, main.wound, state.stats?.wound ?? "");
    if (main.save) safeSetText(form, main.save, state.stats?.save ?? "");

    const st = K.stats;
    const stats = state.stats || {};
    if (st.int) safeSetText(form, st.int, stats.int ?? "");
    if (st.ref) safeSetText(form, st.ref, stats.ref ?? "");
    if (st.dex) safeSetText(form, st.dex, stats.dex ?? "");
    if (st.tech) safeSetText(form, st.tech, stats.tech ?? "");
    if (st.char) safeSetText(form, st.char, stats.char ?? "");
    if (st.will) safeSetText(form, st.will, stats.will ?? "");
    if (st.luck && typeof st.luck === "object") {
        const lk = stats.luck ?? "";
        if (st.luck["luck-actual"]) safeSetText(form, st.luck["luck-actual"], lk);
        if (st.luck["luck-max"]) safeSetText(form, st.luck["luck-max"], lk);
    }
    if (st.spd) safeSetText(form, st.spd, stats.spd ?? "");
    if (st.body) safeSetText(form, st.body, stats.body ?? "");
    if (st.emp && typeof st.emp === "object") {
        const em = stats.emp ?? "";
        if (st.emp["emp-actual"]) safeSetText(form, st.emp["emp-actual"], em);
        if (st.emp["emp-max"]) safeSetText(form, st.emp["emp-max"], em);
    }
}

function fillArmor(form, state) {
    const K = window.PDF_EXPORT_KEYS?.armor;
    if (!K) return;
    const armor = state.equipment?.armor || {};
    ["head", "body", "shield"].forEach(slot => {
        const cfg = K[slot];
        if (!cfg) return;
        const a = armor[slot] || {};
        if (cfg.name) safeSetText(form, cfg.name, a.name ?? "");
        if (cfg.AC) safeSetText(form, cfg.AC, a.sp ?? "");
        if (cfg.penalty) safeSetText(form, cfg.penalty, a.penalty ?? "");
    });
}

function fillWeapons(form, state) {
    const K = window.PDF_EXPORT_KEYS?.weapons;
    if (!K) return;
    const weapons = state.equipment?.weapons || [];
    const slotKeys = ["weapon-1", "weapon-2", "weapon-3"];
    slotKeys.forEach((sk, i) => {
        const cfg = K[sk];
        if (!cfg) return;
        const w = weapons[i];
        if (cfg.name) safeSetText(form, cfg.name, w?.name ?? "");
        if (cfg.damage) safeSetText(form, cfg.damage, w?.dmg ?? "");
        if (cfg.speed) safeSetText(form, cfg.speed, w?.rof ?? "");
        if (cfg.note) safeSetText(form, cfg.note, w?.note ?? "");
    });
}

function fillEquipmentBlock(form, state) {
    const K = window.PDF_EXPORT_KEYS?.equipment;
    if (!K) return;
    const eq = state.equipment || {};
    const gear = eq.gear || [];
    const ns = K["names-start-id"];
    const ne = K["names-end-id"];
    const zs = K["notes-start-id"];
    const ze = K["notes-end-id"];
    if (ns && ne && zs && ze) {
        const nameIds = expandTextFieldRange(ns, ne);
        const noteIds = expandTextFieldRange(zs, ze);
        const maxLines = Math.min(nameIds.length, noteIds.length, gear.length);
        for (let i = 0; i < maxLines; i++) {
            const g = gear[i];
            const label = g?.name || "";
            const cnt = g?.count ? String(g.count).trim() : "";
            const lineName =
                label && cnt ? `${label} ×${cnt}` : label || cnt;
            safeSetText(form, nameIds[i], lineName);
            safeSetText(form, noteIds[i], g?.note ?? "");
        }
    }
    const ammoStr = (eq.ammo || [])
        .map(a => {
            const n = a.name || "Боеприпасы";
            const c = a.count !== undefined && a.count !== "" ? a.count : "?";
            return `${n} (${c})`;
        })
        .join(", ");
    if (K.ammo) safeSetText(form, K.ammo, ammoStr);
    if (K.money) safeSetText(form, K.money, eq.money ?? "");
}

function cyberSlotSideKey(side) {
    const s = String(side || "").trim();
    if (s === "П" || s.toUpperCase() === "P" || s === "Пр") return "right";
    return "left";
}

function fillCyberSlotBlock(form, cfg, slot, maxItems) {
    if (!cfg) return;
    safeCheck(form, cfg.isChecked, !!slot?.installed);
    const subKeys = Object.keys(cfg).filter(
        k => k !== "isChecked" && cfg[k] && typeof cfg[k] === "object"
    );
    subKeys.sort();
    const limit = Math.min(subKeys.length, maxItems);
    const items = (slot?.items || []).slice(0, limit);
    subKeys.forEach((sk, i) => {
        const sub = cfg[sk];
        if (!sub) return;
        const it = items[i];
        if (sub.name) safeSetText(form, sub.name, it?.name ?? "");
        if (sub.note) safeSetText(form, sub.note, it?.desc ?? "");
    });
}

function fillCyberware(form, state) {
    const K = window.PDF_EXPORT_KEYS?.cyberware;
    if (!K) return;
    const cyber = state.equipment?.cyberware;
    if (!cyber) return;

    fillCyberSlotBlock(form, K.cyberaudio, cyber.slots?.audio, 3);
    fillCyberSlotBlock(form, K.neurallink, cyber.slots?.neural, 5);

    const eyes = cyber.slots?.eyes || [];
    eyes.forEach(slot => {
        const side = cyberSlotSideKey(slot.side);
        const key = side === "right" ? "cybereye-right" : "cybereye-left";
        fillCyberSlotBlock(form, K[key], slot, 3);
    });

    const arms = cyber.slots?.arms || [];
    arms.forEach(slot => {
        const side = cyberSlotSideKey(slot.side);
        const key = side === "right" ? "cyberarm-right" : "cyberarm-left";
        fillCyberSlotBlock(form, K[key], slot, 4);
    });

    const legs = cyber.slots?.legs || [];
    legs.forEach(slot => {
        const side = cyberSlotSideKey(slot.side);
        const key = side === "right" ? "cyberleg-right" : "cyberleg-left";
        fillCyberSlotBlock(form, K[key], slot, 3);
    });

    const groups = cyber.groups || {};
    const internal = groups.internal || [];
    const ext = groups.external || [];
    const fashion = groups.fashion || [];
    const borg = groups.borgware || [];

    const intCfg = K.internal;
    if (intCfg) {
        fillRangeParallel(
            form,
            intCfg["internal-name-start-id"],
            intCfg["internal-name-end-id"],
            intCfg["internal-note-start-id"],
            intCfg["internal-note-end-id"],
            internal
        );
    }
    const exCfg = K.external;
    if (exCfg) {
        fillRangeParallel(
            form,
            exCfg["external-name-start-id"],
            exCfg["external-name-end-id"],
            exCfg["external-note-start-id"],
            exCfg["external-note-end-id"],
            ext
        );
    }
    const stCfg = K.style;
    if (stCfg) {
        fillRangeParallel(
            form,
            stCfg["style-name-start-id"],
            stCfg["style-name-end-id"],
            stCfg["style-note-start-id"],
            stCfg["style-note-end-id"],
            fashion
        );
    }
    const boCfg = K.borg;
    if (boCfg) {
        fillRangeParallel(
            form,
            boCfg["borg-name-start-id"],
            boCfg["borg-name-end-id"],
            boCfg["borg-note-start-id"],
            boCfg["borg-note-end-id"],
            borg
        );
    }
}

let pdfLibLoadPromise = null;

async function loadPdfLib() {
    if (!pdfLibLoadPromise) {
        pdfLibLoadPromise = import(/* webpackIgnore: true */ pdfLibModuleUrl()).catch(
            err => {
                console.warn(
                    "Локальный pdf-lib не загрузился, пробуем unpkg:",
                    err?.message || err
                );
                return import("https://unpkg.com/pdf-lib@1.17.1/+esm");
            }
        );
    }
    return pdfLibLoadPromise;
}

async function exportCharacterSheetPdf() {
    const state = window.DataPool.characterState;
    window.DataPool.SkillsUI?.normalizeSkillsState?.(state);

    if (!window.PDF_EXPORT_KEYS) {
        window.alert("Не загружены ключи экспорта (export-keys.js).");
        return;
    }

    let PDFDocument;
    try {
        ({ PDFDocument } = await loadPdfLib());
    } catch (e) {
        console.error(e);
        window.alert(
            "Не удалось загрузить pdf-lib. Выполните сборку сайта (npm run build), чтобы скопировать node_modules/pdf-lib в _site."
        );
        return;
    }

    let bytes;
    try {
        const res = await fetch(templateUrl());
        if (!res.ok) throw new Error(String(res.status));
        bytes = await res.arrayBuffer();
    } catch (e) {
        console.error(e);
        window.alert(
            "Шаблон PDF не найден. Ожидается character-sheet-template.pdf в app/character-sheet/ui/steps/07-export/"
        );
        return;
    }

    let pdfDoc;
    try {
        pdfDoc = await PDFDocument.load(bytes, {
            ignoreEncryption: true
        });
    } catch (e) {
        console.error(e);
        window.alert("Не удалось прочитать PDF-шаблон.");
        return;
    }

    let form;
    try {
        form = pdfDoc.getForm();
    } catch (e) {
        console.error(e);
        window.alert("В PDF нет интерактивной формы (AcroForm).");
        return;
    }

    fillMainAndStats(form, state);
    fillAllSkills(form, state);
    fillArmor(form, state);
    fillWeapons(form, state);
    fillEquipmentBlock(form, state);
    fillCyberware(form, state);

    let out;
    try {
        out = await pdfDoc.save({
            useObjectStreams: false,
            updateFieldAppearances: false
        });
    } catch (e) {
        console.error(e);
        window.alert("Не удалось сохранить PDF.");
        return;
    }

    const blob = new Blob([out], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = safeFileName(state.name);
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

window.DataPool = window.DataPool || {};
window.DataPool.exportCharacterSheetPdf = exportCharacterSheetPdf;
