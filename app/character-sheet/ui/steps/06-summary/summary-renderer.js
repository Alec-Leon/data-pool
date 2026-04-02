window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

const SUMMARY_DERIVED_STATS = ["hp", "wound", "save", "humanity"];
const SUMMARY_CORE_STATS = [
    "int", "ref", "dex", "tech", "char",
    "will", "luck", "spd", "body", "emp"
];

function escapeSummaryText(s) {
    if (s == null || s === "") return "";
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatSummaryStat(v) {
    if (v === "" || v === undefined || v === null) return "—";
    return escapeSummaryText(v);
}

function summaryAssetsBase() {
    return typeof window !== "undefined" && window.__BASE_PATH__
        ? window.__BASE_PATH__
        : "/";
}

function renderSummaryExportButtons() {
    const bp = summaryAssetsBase();
    return `
            <div class="summary-export-actions">
                <button type="button" class="summary-export-btn" id="summary-export-pdf-btn">
                    <img src="${bp}images/content/character-sheet/pdf.png"
                        width="52" height="52" alt="" loading="lazy">
                    <span>Экспорт в PDF</span>
                </button>
                <button type="button" class="summary-export-btn summary-export-btn--foundry" id="summary-export-foundry-btn">
                    <img src="${bp}images/content/character-sheet/foundry.png"
                        width="52" height="52" alt="" loading="lazy">
                    <span>Экспорт в Foundry</span>
                </button>
            </div>
        `;
}

function renderStandaloneExportCard() {
    return `
        <div class="enemy-card summary-export-only-card">
            <h3 class="column-name">Экспорт</h3>
            ${renderSummaryExportButtons()}
        </div>
    `;
}

function renderSummaryStep(container) {
    const state = window.DataPool.characterState;
    window.DataPool.SkillsUI?.normalizeSkillsState?.(state);
    const hasRoleBlock = !!(state.role || state.roleLevel);
    container.innerHTML = `
        <div class="char-summary">
            <h1>${escapeSummaryText(state.name) || "Безымянный персонаж"}</h1>
            ${hasRoleBlock ? renderSummaryRole(state) : renderStandaloneExportCard()}
            ${renderSummaryStats(state)}
            ${renderSummarySkills(state)}
            ${renderSummaryEquipment(state)}
            ${renderSummaryCyberware(state)}
        </div>
    `;
}

function renderSummaryRole(state) {
    const roles = window.DataPool.ROLES || {};
    const roleData = roles[state.role];
    const titleText = roleData?.label || state.role || "—";
    const levelHtml = state.roleLevel
        ? ` <span class="summary-role-level">(Ур. ${escapeSummaryText(state.roleLevel)})</span>`
        : "";
    const abilityBlock = roleData
        ? `
            <div class="role-info summary-role-info">
                <strong>Способность:</strong>
                <p>${roleData.ability}</p>
                <button type="button" id="summary-role-link" class="summary-role-link">
                    Подробнее →
                </button>
            </div>`
        : "";
    return `
        <div class="enemy-card summary-role-card">
            <h3 class="column-name">Роль</h3>
            <div class="summary-role-layout">
                <div class="summary-role-column">
                    <div class="summary-role-title">${escapeSummaryText(titleText)}${levelHtml}</div>
                    ${abilityBlock}
                </div>
                <aside class="summary-export-aside" aria-label="Экспорт листа">
                    <h4 class="summary-export-title">Экспорт</h4>
                    ${renderSummaryExportButtons()}
                </aside>
            </div>
        </div>
    `;
}

function renderSummaryStats(state) {
    const stats = state.stats;
    const derivedHtml = SUMMARY_DERIVED_STATS.map(stat => `
        <div class="attr summary-stat-attr summary-stat-derived">
            <span class="label">${STAT_LABELS[stat]}</span>
            <span class="value">${formatSummaryStat(stats[stat])}</span>
        </div>
    `).join("");
    const coreHtml = SUMMARY_CORE_STATS.map(stat => `
        <div class="attr summary-stat-attr">
            <span class="label">${STAT_LABELS[stat]}</span>
            <span class="value">${formatSummaryStat(stats[stat])}</span>
        </div>
    `).join("");
    return `
        <div class="enemy-card summary-stats-card">
            <h3 class="column-name">Характеристики</h3>
            <div class="summary-derived-strip">
                ${derivedHtml}
            </div>
            <div class="enemy-attributes summary-core-attrs">
                ${coreHtml}
            </div>
        </div>
    `;
}

function renderSummarySkills(state) {
    if (!state.skills) return "";
    return `
        <div class="enemy-card">
            <h3 class="column-name">Навыки</h3>
            <div class="skills-list">
                ${renderEnemySkills(state.skills)}
            </div>
        </div>
    `;
}

function renderSummaryEquipment(state) {
    const eq = state.equipment;
    return `
        <div class="enemy-card">
            <h3 class="column-name">Снаряжение</h3>
            <ul>
                ${eq.weapons.map(w =>
        `<li>${w.name || "Оружие"} (${w.dmg || "-"})</li>`
    ).join("")}
                ${eq.gear.map(g =>
        `<li>${g.name || "Предмет"} x${g.count || 1}</li>`
    ).join("")}
                ${eq.ammo.map(a =>
        `<li>${a.name || "Боеприпасы"} x${a.count || 1}</li>`
    ).join("")}
            </ul>
            <div>Деньги: ${eq.money || 0}</div>
        </div>
    `;
}

function renderSummaryCyberware(state) {
    const cyber = state.equipment.cyberware;
    let html = "";
    const renderSlot = (title, slot) => {
        if (!slot.installed) {
            html += `<div>${title} — отсутствует</div>`;
            return;
        }
        html += `<div><b>${title}</b></div>`;
        slot.items.forEach(it => {
            html += `<div>• ${it.name || "Имплант"}</div>`;
        });
    };
    renderSlot("Кибераудио", cyber.slots.audio);
    renderSlot("Нейролинк", cyber.slots.neural);
    cyber.slots.eyes.forEach(e =>
        renderSlot(`Киберглаз (${e.side})`, e)
    );
    cyber.slots.arms.forEach(a =>
        renderSlot(`Киберрука (${a.side})`, a)
    );
    cyber.slots.legs.forEach(l =>
        renderSlot(`Кибернога (${l.side})`, l)
    );
    const cyberGroupLabels =
        window.DataPool.CyberwareUI?.CYBERWARE_GROUP_LABELS || {};
    Object.entries(cyber.groups).forEach(([key, items]) => {
        if (!items.length) return;
        const groupTitle =
            cyberGroupLabels[key] || cyberGroupLabels[String(key)] || key;
        html += `<div><b>${escapeSummaryText(groupTitle)}</b></div>`;
        items.forEach(it => {
            html += `<div>• ${escapeSummaryText(it.name || "Имплант")}</div>`;
        });
    });
    return `
        <div class="enemy-card">
            <h3 class="column-name">Киберимпланты</h3>
            ${html || "Нет имплантов"}
        </div>
    `;
}

window.DataPool.CharSteps.summary =
    window.DataPool.CharSteps.summary || {};
window.DataPool.CharSteps.summary.render = renderSummaryStep;
