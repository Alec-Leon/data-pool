window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

const LANGUAGE_STREET_FIXED_NAME = "Уличный Слэнг";

function escapeSkillAttr(s) {
    return String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;");
}

function skillPointMultiplier(skillKey) {
    const label = SKILL_LABELS[skillKey];
    if (!label) return 1;
    const lower = label.toLowerCase();
    if (lower.includes("(х2)") || lower.includes("(x2)")) return 2;
    return 1;
}

function normalizeSkillsState(state) {
    Object.entries(SKILL_GROUPS).forEach(([groupKey, skillKeys]) => {
        if (!state.skills[groupKey]) state.skills[groupKey] = {};
        const g = state.skills[groupKey];
        skillKeys.forEach(skillKey => {
            const n = getMultiSkillFieldCount(skillKey);
            if (n === 0) {
                const v = g[skillKey];
                if (Array.isArray(v)) {
                    const first = v.find(
                        r =>
                            r &&
                            String(r.level ?? "").trim() !== ""
                    );
                    g[skillKey] = first
                        ? String(first.level).trim()
                        : "";
                }
                return;
            }
            let arr = g[skillKey];
            if (!Array.isArray(arr)) {
                const legacy =
                    arr === undefined || arr === null
                        ? ""
                        : String(arr).trim();
                arr = [];
                for (let i = 0; i < n; i++) {
                    arr.push({ name: "", level: "" });
                }
                if (legacy) arr[0].level = legacy;
            } else {
                if (arr.length > n) arr = arr.slice(0, n);
                while (arr.length < n) {
                    arr.push({ name: "", level: "" });
                }
            }
            for (let i = 0; i < n; i++) {
                if (!arr[i] || typeof arr[i] !== "object") {
                    arr[i] = { name: "", level: "" };
                }
                arr[i].name = arr[i].name ?? "";
                arr[i].level = arr[i].level ?? "";
            }
            if (skillKey === "language") {
                arr[0].name = LANGUAGE_STREET_FIXED_NAME;
            }
            g[skillKey] = arr;
        });
    });
}

function computeSpentSkillPoints(state) {
    let total = 0;
    for (const [groupKey, skillKeys] of Object.entries(SKILL_GROUPS)) {
        const group = state.skills[groupKey] || {};
        for (const skillKey of skillKeys) {
            const mult = skillPointMultiplier(skillKey);
            const multiN = getMultiSkillFieldCount(skillKey);
            if (multiN > 0 && Array.isArray(group[skillKey])) {
                for (const row of group[skillKey]) {
                    const raw = row?.level;
                    const num =
                        raw === "" || raw === undefined || raw === null
                            ? 0
                            : Number(raw);
                    if (!Number.isFinite(num) || num < 0) continue;
                    total += num * mult;
                }
            } else {
                const raw = group[skillKey];
                const n =
                    raw === "" || raw === undefined || raw === null
                        ? 0
                        : Number(raw);
                if (!Number.isFinite(n) || n < 0) continue;
                total += n * mult;
            }
        }
    }
    return total;
}

function renderScalarSkillRow(groupKey, skillKey, value) {
    const skillLabel = SKILL_LABELS[skillKey];
    const displayVal = Array.isArray(value) ? "" : (value ?? "");
    return `
            <div class="skill-row">
                <span class="skill-name">${skillLabel}</span>
                <input
                    type="number"
                    class="skill-input"
                    data-skill-group="${groupKey}"
                    data-skill="${skillKey}"
                    value="${escapeSkillAttr(displayVal)}"
                >
            </div>
        `;
}

function renderMultiSkillBlock(groupKey, skillKey, rows) {
    const skillLabel = SKILL_LABELS[skillKey];
    const rowHtml = rows.map((row, i) => {
        const isLangFixed = skillKey === "language" && i === 0;
        const nameVal = isLangFixed ? LANGUAGE_STREET_FIXED_NAME : (row.name || "");
        return `
            <div class="skill-multi-row">
                <input
                    type="text"
                    class="skill-multi-name-input"
                    data-skill-group="${groupKey}"
                    data-skill-key="${skillKey}"
                    data-multi-index="${i}"
                    value="${escapeSkillAttr(nameVal)}"
                    ${isLangFixed ? "readonly" : ""}
                    aria-label="Подтип навыка ${i + 1}"
                >
                <input
                    type="number"
                    class="skill-multi-level-input"
                    data-skill-group="${groupKey}"
                    data-skill-key="${skillKey}"
                    data-multi-index="${i}"
                    value="${escapeSkillAttr(row.level ?? "")}"
                    aria-label="Уровень подтипа ${i + 1}"
                >
            </div>
        `;
    }).join("");
    return `
            <div class="skill-multi-block" data-skill-group="${groupKey}" data-skill-multi="${skillKey}">
                <div class="skill-multi-header">${skillLabel}</div>
                <div class="skill-multi-rows">
                    ${rowHtml}
                </div>
            </div>
        `;
}

function renderSkillGroup(groupKey, label, state) {
    const group = state.skills[groupKey] || {};
    const skills = SKILL_GROUPS[groupKey] || [];
    const items = skills.map(skillKey => {
        const n = getMultiSkillFieldCount(skillKey);
        if (n === 0) {
            return renderScalarSkillRow(
                groupKey,
                skillKey,
                group[skillKey]
            );
        }
        const rows = Array.isArray(group[skillKey])
            ? group[skillKey]
            : [];
        return renderMultiSkillBlock(groupKey, skillKey, rows);
    }).join("");
    return `
        <div class="skill-group-block">
            <h3 class="skill-group-title">${label}</h3>

            <div class="skill-group-grid">
                ${items}
            </div>
        </div>
    `;
}

function renderSkillsStep(container) {
    const state = window.DataPool.characterState;
    normalizeSkillsState(state);
    const spent = computeSpentSkillPoints(state);
    container.innerHTML = `
        <div class="char-step char-skills-step">
            <div class="skills-step-head">
                <h2>Навыки</h2>
                <div class="skills-spent-counter"
                    id="char-skills-spent-total"
                    role="status"
                    aria-live="polite">
                    <span class="skills-spent-label">Потрачено очков</span>
                    <span class="skills-spent-value">${spent}</span>
                </div>
            </div>
            <div class="char-skills-layout">
                ${Object.entries(SKILL_GROUP_LABELS)
        .map(([groupKey, lbl]) =>
            renderSkillGroup(groupKey, lbl, state)
        )
        .join("")}
            </div>
        </div>
    `;
}

window.DataPool.CharSteps.skills =
    window.DataPool.CharSteps.skills || {};
window.DataPool.CharSteps.skills.render = renderSkillsStep;
window.DataPool = window.DataPool || {};
window.DataPool.SkillsUI = {
    computeSpentSkillPoints,
    normalizeSkillsState,
    refreshSpentPointsCounter() {
        const el = document.getElementById("char-skills-spent-total");
        if (!el) return;
        const val = el.querySelector(".skills-spent-value");
        if (!val) return;
        const st = window.DataPool.characterState;
        normalizeSkillsState(st);
        val.textContent = String(computeSpentSkillPoints(st));
    }
};
