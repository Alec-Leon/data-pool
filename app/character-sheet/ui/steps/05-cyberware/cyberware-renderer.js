window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

const CYBERWARE_GROUP_LABELS = {
    internal: "Внутренние",
    external: "Внешние",
    fashion: "Стилевые",
    borgware: "Боргирование"
};

function renderCyberwareStep(container) {
    const state = window.DataPool.characterState;
    const cyber = state.equipment.cyberware;
    container.innerHTML = `
        <div class="char-step cyberware-root">
            <h2>Киберимпланты</h2>
            <div class="cyberware-section">
                <h3>Основные импланты</h3>
                ${renderCyberSlot("Кибераудио", cyber.slots.audio)}
                ${renderCyberSlot("Нейролинк", cyber.slots.neural)}
                ${renderCyberPaired("Киберглаз", cyber.slots.eyes)}
                ${renderCyberPaired("Киберрука", cyber.slots.arms)}
                ${renderCyberPaired("Кибернога", cyber.slots.legs)}
            </div>
            <div class="cyberware-section">
                <h3>Дополнительные импланты</h3>
                ${["internal", "external", "fashion", "borgware"]
        .map(key => renderCyberGroup(CYBERWARE_GROUP_LABELS[key], key))
        .join("")}
            </div>
        </div>
    `;
}

function renderCyberSlot(label, slot) {
    return `
        <div class="cyber-slot">
            <label>
                <input type="checkbox"
                    class="cyber-toggle"
                    data-single-slot="${label}"
                    ${slot.installed ? "checked" : ""}>
                ${label}
            </label>
            ${
        slot.installed
            ? renderCyberItems(slot.items)
            : ""
    }
        </div>
    `;
}

function renderCyberPaired(label, slots) {
    return slots.map((slot, i) => `
        <div class="cyber-slot">
            <label>
                <input type="checkbox"
                    class="cyber-toggle"
                    data-pair="${label}"
                    data-index="${i}"
                    ${slot.installed ? "checked" : ""}>
                ${label} (${slot.side})
            </label>
            ${
        slot.installed
            ? renderCyberItems(slot.items)
            : ""
    }
        </div>
    `).join("");
}

function renderCyberItems(items) {
    return `
        <div class="cyber-items">
            ${items.map((it, i) => `
                <div class="cyber-item">
                    <input placeholder="Название"
                        value="${it.name || ''}"
                        data-item-name="${i}">
                    <input placeholder="Описание"
                        value="${it.desc || ''}"
                        data-item-desc="${i}">
                    <button type="button"
                        class="char-equipment-remove"
                        data-remove-slot-item="${i}"
                        title="Удалить"
                        aria-label="Удалить имплант">✕</button>
                </div>
            `).join("")}
            <button type="button" class="cyber-add-item char-btn-add">
                + добавить имплант
            </button>
        </div>
    `;
}

function renderCyberGroup(title, key) {
    const state = window.DataPool.characterState;
    const items = state.equipment.cyberware.groups[key];
    return `
        <div class="cyber-group">
            <h4>${title}</h4>
            <div class="cyber-items">
                ${items.map((it, i) => `
                    <div class="cyber-item">
                        <input
                            placeholder="Название"
                            value="${it.name || ''}"
                            data-group="${key}"
                            data-group-name="${i}">
                        <input
                            placeholder="Описание"
                            value="${it.desc || ''}"
                            data-group="${key}"
                            data-group-desc="${i}">
                        <button type="button"
                            class="char-equipment-remove"
                            data-remove-group-item="${key}"
                            data-remove-group-index="${i}"
                            title="Удалить"
                            aria-label="Удалить имплант">✕</button>
                    </div>
                `).join("")}
            </div>
            <button type="button" class="cyber-add-group char-btn-add"
                data-group="${key}">
                + добавить
            </button>
        </div>
    `;
}

window.DataPool.CharSteps.cyberware =
    window.DataPool.CharSteps.cyberware || {};
window.DataPool.CharSteps.cyberware.render = renderCyberwareStep;
window.DataPool = window.DataPool || {};
window.DataPool.CyberwareUI = {
    renderCyberSlot,
    renderCyberPaired,
    renderCyberItems,
    renderCyberGroup,
    CYBERWARE_GROUP_LABELS
};
