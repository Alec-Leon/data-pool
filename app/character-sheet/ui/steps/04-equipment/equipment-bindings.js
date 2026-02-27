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
    document.querySelectorAll("[data-gear]")
        .forEach(input => {
            input.addEventListener("input", e => {
                const i = e.target.dataset.gear;
                const field = e.target.dataset.field;
                state.equipment.gear[i][field] = e.target.value;
            });
        });
    document.querySelectorAll("[data-remove-gear]")
        .forEach(btn => {
            btn.addEventListener("click", e => {
                const i = e.target.dataset.removeGear;
                state.equipment.gear.splice(i, 1);
                window.DataPool.EquipmentUI.renderGear();
            });
        });
}

function bindAmmoInputs() {
    const state = window.DataPool.characterState;
    document.querySelectorAll("[data-ammo]")
        .forEach(input => {
            input.addEventListener("input", e => {
                const i = e.target.dataset.ammo;
                const field = e.target.dataset.field;
                state.equipment.ammo[i][field] = e.target.value;
            });
        });
    document.querySelectorAll("[data-remove-ammo]")
        .forEach(btn => {
            btn.addEventListener("click", e => {
                const i = e.target.dataset.removeAmmo;
                state.equipment.ammo.splice(i, 1);
                window.DataPool.EquipmentUI.renderAmmo();
            });
        });
}

function bindWeaponInputs() {
    const state = window.DataPool.characterState;
    document.querySelectorAll("[data-weapon]")
        .forEach(input => {
            input.addEventListener("input", e => {
                const i = e.target.dataset.weapon;
                const field = e.target.dataset.field;
                state.equipment.weapons[i][field] = e.target.value;
            });
        });
    document.querySelectorAll("[data-remove-weapon]")
        .forEach(btn => {

            btn.addEventListener("click", e => {

                const i = e.target.dataset.removeWeapon;
                state.equipment.weapons.splice(i, 1);
                window.DataPool.EquipmentUI.renderWeapons();
            });
        });
}

window.DataPool.CharSteps.equipment =
    window.DataPool.CharSteps.equipment || {};
window.DataPool.CharSteps.equipment.bind = bindEquipmentStep;
