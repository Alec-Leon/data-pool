window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function bindEquipmentStep() {
    bindMoneyInput();
    bindEquipmentButtons();
    bindArmorInputs();
    bindWeaponInputs();
    bindGearInputs();
    bindAmmoInputs();
}

function bindMoneyInput() {
    const state = window.DataPool.characterState;
    document.getElementById("char-money")
        ?.addEventListener("input", e => {
            state.equipment.money = e.target.value;
        });
}

function bindEquipmentButtons() {
    const state = window.DataPool.characterState;
    document.getElementById("add-weapon")
        ?.addEventListener("click", () => {
            state.equipment.weapons.push({
                name: '',
                dmg: '',
                rof: '',
                note: ''
            });
            window.DataPool.EquipmentUI.renderWeapons();
        });
    document.getElementById("add-gear")
        ?.addEventListener("click", () => {
            state.equipment.gear.push({
                name: '',
                count: '',
                note: ''
            });
            window.DataPool.EquipmentUI.renderGear();
        });
    document.getElementById("add-ammo")
        ?.addEventListener("click", () => {
            state.equipment.ammo.push({
                name: '',
                count: '',
                note: ''
            });
            window.DataPool.EquipmentUI.renderAmmo();
        });
}

function bindArmorInputs() {
    const state = window.DataPool.characterState;
    document.querySelectorAll("[data-armor]")
        .forEach(input => {
            input.addEventListener("input", e => {
                const slot = e.target.dataset.armor;
                const field = e.target.dataset.field;
                state.equipment.armor[slot][field] = e.target.value;
            });
        });
}

function bindGearInputs() {
    const state = window.DataPool.characterState;
    const container = document.getElementById("char-gear");
    if (!container) return;
    container.addEventListener("input", e => {
        const el = e.target;
        if (!(el instanceof HTMLInputElement) || el.dataset.gear === undefined) return;
        const i = el.dataset.gear;
        const field = el.dataset.field;
        const row = state.equipment.gear[i];
        if (!field || !row) return;
        row[field] = el.value;
    });
    container.addEventListener("click", e => {
        const btn = e.target.closest("[data-remove-gear]");
        if (!btn || !container.contains(btn)) return;
        e.preventDefault();
        const i = Number(btn.dataset.removeGear);
        if (!Number.isInteger(i) || i < 0) return;
        state.equipment.gear.splice(i, 1);
        window.DataPool.EquipmentUI.renderGear();
    });
}

function bindAmmoInputs() {
    const state = window.DataPool.characterState;
    const container = document.getElementById("char-ammo");
    if (!container) return;
    container.addEventListener("input", e => {
        const el = e.target;
        if (!(el instanceof HTMLInputElement) || el.dataset.ammo === undefined) return;
        const i = el.dataset.ammo;
        const field = el.dataset.field;
        const row = state.equipment.ammo[i];
        if (!field || !row) return;
        row[field] = el.value;
    });
    container.addEventListener("click", e => {
        const btn = e.target.closest("[data-remove-ammo]");
        if (!btn || !container.contains(btn)) return;
        e.preventDefault();
        const i = Number(btn.dataset.removeAmmo);
        if (!Number.isInteger(i) || i < 0) return;
        state.equipment.ammo.splice(i, 1);
        window.DataPool.EquipmentUI.renderAmmo();
    });
}

function bindWeaponInputs() {
    const state = window.DataPool.characterState;
    const container = document.getElementById("char-weapons");
    if (!container) return;
    container.addEventListener("input", e => {
        const el = e.target;
        if (!(el instanceof HTMLInputElement) || el.dataset.weapon === undefined) return;
        const i = el.dataset.weapon;
        const field = el.dataset.field;
        const row = state.equipment.weapons[i];
        if (!field || !row) return;
        row[field] = el.value;
    });
    container.addEventListener("click", e => {
        const btn = e.target.closest("[data-remove-weapon]");
        if (!btn || !container.contains(btn)) return;
        e.preventDefault();
        const i = Number(btn.dataset.removeWeapon);
        if (!Number.isInteger(i) || i < 0) return;
        state.equipment.weapons.splice(i, 1);
        window.DataPool.EquipmentUI.renderWeapons();
    });
}

window.DataPool.CharSteps.equipment =
    window.DataPool.CharSteps.equipment || {};
window.DataPool.CharSteps.equipment.bind = bindEquipmentStep;
