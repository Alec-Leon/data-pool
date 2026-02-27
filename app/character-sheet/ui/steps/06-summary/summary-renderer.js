window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function renderSummaryStep(container) {
    const state = window.DataPool.characterState;
    container.innerHTML = `
        <div class="char-summary">
            <h1>${state.name || "Безымянный персонаж"}</h1>
            ${renderSummaryRole(state)}
            ${renderSummaryStats(state)}
            ${renderSummarySkills(state)}
            ${renderSummaryEquipment(state)}
            ${renderSummaryCyberware(state)}
        </div>
    `;
}

function renderSummaryRole(state) {
    if (!state.role && !state.roleLevel) return "";
    return `
        <div class="enemy-card">
            <h3 class="column-name">Роль</h3>
            <div>
                ${state.role || "—"}
                ${state.roleLevel ? `(Ур. ${state.roleLevel})` : ""}
            </div>
        </div>
    `;
}

function renderSummaryStats(state) {
    const stats = state.stats;
    return `
        <div class="enemy-card">
            <h3 class="column-name">Характеристики</h3>
            <div class="enemy-attributes">
                ${CORE_STATS.map(stat => `
                    <div class="attr">
                        <span class="label">${STAT_LABELS[stat]}</span>
                        <span class="value">${stats[stat] || "-"}</span>
                    </div>
                `).join("")}
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
    Object.entries(cyber.groups).forEach(([key, items]) => {
        if (!items.length) return;
        html += `<div><b>${key}</b></div>`;
        items.forEach(it => {
            html += `<div>• ${it.name || "Имплант"}</div>`;
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
