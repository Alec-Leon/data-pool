window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function renderEquipmentStep(container) {
    const state = window.DataPool.characterState;
    container.innerHTML = `
    <div class="char-step">
        <h2>Деньги</h2>
        <input id="char-money"
            type="number"
            placeholder="Евродоллары"
            value="${state.equipment.money || ''}">
        <h2>Оружие</h2>
        <div id="char-weapons"></div>
        <button type="button" id="add-weapon" class="char-btn-add">+ Добавить оружие</button>
        <h2>Броня</h2>
        ${renderArmorBlock(state)}
        <h2>Боеприпасы</h2>
        <div id="char-ammo"></div>
        <button type="button" id="add-ammo" class="char-btn-add">+ Добавить боеприпасы</button>
        <h2>Снаряжение</h2>
        <div id="char-gear"></div>
        <button type="button" id="add-gear" class="char-btn-add">+ Добавить предмет</button>
    </div>
    `;
    renderWeapons();
    renderAmmo();
    renderGear();
}

function renderArmorBlock(state) {
    const armor = state.equipment.armor;
    const slot = (key, label) => `
        <div class="armor-row">
            <strong>${label}</strong>
            <input placeholder="Название"
                data-armor="${key}"
                data-field="name"
                value="${armor[key].name || ''}">
            <input placeholder="ОС"
                data-armor="${key}"
                data-field="sp"
                value="${armor[key].sp || ''}">
            <input placeholder="Штраф"
                data-armor="${key}"
                data-field="penalty"
                value="${armor[key].penalty || ''}">
        </div>
    `;
    return `
        <div class="armor-block">
            ${slot("head","Голова")}
            ${slot("body","Тело")}
            ${slot("shield","Щит")}
        </div>
    `;
}

function renderGear() {
    const state = window.DataPool.characterState;
    const container = document.getElementById("char-gear");
    container.innerHTML = state.equipment.gear.map((g, i) => `
        <div class="gear-row">
            <input placeholder="Название"
                data-gear="${i}"
                data-field="name"
                value="${g.name || ''}">
            <input placeholder="Кол-во"
                data-gear="${i}"
                data-field="count"
                value="${g.count || ''}">
            <input placeholder="Заметка"
                data-gear="${i}"
                data-field="note"
                value="${g.note || ''}">
            <button type="button"
                class="char-equipment-remove"
                data-remove-gear="${i}"
                title="Удалить"
                aria-label="Удалить предмет">✕</button>
        </div>
    `).join("");
}

function renderAmmo() {
    const state = window.DataPool.characterState;
    const container = document.getElementById("char-ammo");
    container.innerHTML = state.equipment.ammo.map((a, i) => `
        <div class="gear-row">
            <input placeholder="Название"
                data-ammo="${i}"
                data-field="name"
                value="${a.name || ''}">
            <input placeholder="Кол-во"
                data-ammo="${i}"
                data-field="count"
                value="${a.count || ''}">
            <input placeholder="Заметка"
                data-ammo="${i}"
                data-field="note"
                value="${a.note || ''}">
            <button type="button"
                class="char-equipment-remove"
                data-remove-ammo="${i}"
                title="Удалить"
                aria-label="Удалить боеприпасы">✕</button>
        </div>
    `).join("");
}

function renderWeapons() {
    const state = window.DataPool.characterState;
    const container = document.getElementById("char-weapons");
    container.innerHTML = state.equipment.weapons.map((w, i) => `
        <div class="weapon-row">
            <input placeholder="Название"
                data-weapon="${i}"
                data-field="name"
                value="${w.name || ''}">
            <input placeholder="Урон"
                data-weapon="${i}"
                data-field="dmg"
                value="${w.dmg || ''}">
            <input placeholder="СКА"
                data-weapon="${i}"
                data-field="rof"
                value="${w.rof || ''}">
            <input placeholder="Заметка"
                data-weapon="${i}"
                data-field="note"
                value="${w.note || ''}">
            <button type="button"
                class="char-equipment-remove"
                data-remove-weapon="${i}"
                title="Удалить"
                aria-label="Удалить оружие">✕</button>
        </div>
    `).join("");
}

window.DataPool.CharSteps.equipment =
    window.DataPool.CharSteps.equipment || {};
window.DataPool.CharSteps.equipment.render = renderEquipmentStep;
window.DataPool = window.DataPool || {};
window.DataPool.EquipmentUI = {
    renderArmorBlock,
    renderWeapons,
    renderAmmo,
    renderGear
};
