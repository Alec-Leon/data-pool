window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function renderCyberwareStep(container) {
    const state = window.DataPool.characterState;
    const cyber = state.equipment.cyberware;
    container.innerHTML = `
        <div class="char-step">
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
                ${renderCyberGroup("Внутренние", "internal")}
                ${renderCyberGroup("Внешние", "external")}
                ${renderCyberGroup("Стилевые", "fashion")}
                ${renderCyberGroup("Боргирование", "borgware")}
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
                    data-single-slot="${label}">
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
                    data-index="${i}">
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
                </div>
            `).join("")}
            <button class="cyber-add-item">
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
                    </div>
                `).join("")}
            </div>
            <button class="cyber-add-group"
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
    renderCyberGroup
};
