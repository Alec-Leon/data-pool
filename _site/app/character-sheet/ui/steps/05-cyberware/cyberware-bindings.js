window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function cyberwareResolveSlot(cyber, toggle) {
    if (!toggle) return null;
    const pair = toggle.dataset.pair;
    const index = toggle.dataset.index;
    const single = toggle.dataset.singleSlot;
    if (single) {
        const map = {
            "Кибераудио": "audio",
            "Нейролинк": "neural"
        };
        return cyber.slots[map[single]];
    }
    if (pair) {
        const map = {
            "Киберглаз": "eyes",
            "Киберрука": "arms",
            "Кибернога": "legs"
        };
        return cyber.slots[map[pair]][index];
    }
    return null;
}

function bindCyberwareInputs() {
    const root = document.querySelector("#char-step-content .cyberware-root");
    if (!root) return;

    const state = window.DataPool.characterState;
    const cyber = state.equipment.cyberware;

    root.addEventListener("change", e => {
        const t = e.target;
        if (!t.matches(".cyber-toggle")) return;
        const slot = cyberwareResolveSlot(cyber, t);
        if (!slot) return;
        slot.installed = t.checked;
        if (!slot.installed) {
            slot.items.length = 0;
        } else if (slot.items.length === 0) {
            slot.items.push({ name: "", desc: "" });
        }
        window.DataPool.CharacterUIStep.renderStep();
    });

    root.addEventListener("click", e => {
        const addSlotBtn = e.target.closest(".cyber-add-item");
        if (addSlotBtn) {
            e.preventDefault();
            const slotEl = addSlotBtn.closest(".cyber-slot");
            const toggle = slotEl?.querySelector(".cyber-toggle");
            const slot = cyberwareResolveSlot(cyber, toggle);
            if (!slot) return;
            slot.items.push({ name: "", desc: "" });
            window.DataPool.CharacterUIStep.renderStep();
            return;
        }

        const addGroupBtn = e.target.closest(".cyber-add-group");
        if (addGroupBtn) {
            e.preventDefault();
            const groupKey = addGroupBtn.dataset.group;
            if (!groupKey || !cyber.groups[groupKey]) return;
            cyber.groups[groupKey].push({ name: "", desc: "" });
            window.DataPool.CharacterUIStep.renderStep();
            return;
        }

        const rmSlot = e.target.closest("[data-remove-slot-item]");
        if (rmSlot) {
            e.preventDefault();
            const slotEl = rmSlot.closest(".cyber-slot");
            const toggle = slotEl?.querySelector(".cyber-toggle");
            const slot = cyberwareResolveSlot(cyber, toggle);
            if (!slot) return;
            const i = Number(rmSlot.dataset.removeSlotItem);
            if (!Number.isInteger(i) || i < 0) return;
            slot.items.splice(i, 1);
            window.DataPool.CharacterUIStep.renderStep();
            return;
        }

        const rmGroup = e.target.closest("[data-remove-group-item]");
        if (rmGroup) {
            e.preventDefault();
            const key = rmGroup.dataset.removeGroupItem;
            const i = Number(rmGroup.dataset.removeGroupIndex);
            if (!key || !cyber.groups[key] || !Number.isInteger(i) || i < 0) return;
            cyber.groups[key].splice(i, 1);
            window.DataPool.CharacterUIStep.renderStep();
        }
    });

    root.addEventListener("input", e => {
        const t = e.target;
        if (!(t instanceof HTMLInputElement)) return;

        if (t.matches("[data-item-name]")) {
            const slotEl = t.closest(".cyber-slot");
            const toggle = slotEl?.querySelector(".cyber-toggle");
            const slot = cyberwareResolveSlot(cyber, toggle);
            if (!slot) return;
            const itemIndex = Number(t.dataset.itemName);
            if (!Number.isInteger(itemIndex) || !slot.items[itemIndex]) return;
            slot.items[itemIndex].name = t.value;
            return;
        }

        if (t.matches("[data-item-desc]")) {
            const slotEl = t.closest(".cyber-slot");
            const toggle = slotEl?.querySelector(".cyber-toggle");
            const slot = cyberwareResolveSlot(cyber, toggle);
            if (!slot) return;
            const itemIndex = Number(t.dataset.itemDesc);
            if (!Number.isInteger(itemIndex) || !slot.items[itemIndex]) return;
            slot.items[itemIndex].desc = t.value;
            return;
        }

        if (t.matches("[data-group-name]")) {
            const group = t.dataset.group;
            const index = Number(t.dataset.groupName);
            if (!group || !cyber.groups[group]?.[index]) return;
            cyber.groups[group][index].name = t.value;
            return;
        }

        if (t.matches("[data-group-desc]")) {
            const group = t.dataset.group;
            const index = Number(t.dataset.groupDesc);
            if (!group || !cyber.groups[group]?.[index]) return;
            cyber.groups[group][index].desc = t.value;
        }
    });
}

window.DataPool.CharSteps.cyberware =
    window.DataPool.CharSteps.cyberware || {};
window.DataPool.CharSteps.cyberware.bind = bindCyberwareInputs;
