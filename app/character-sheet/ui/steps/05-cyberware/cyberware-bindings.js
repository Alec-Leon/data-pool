window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function bindCyberwareInputs() {
    const state = window.DataPool.characterState;
    const cyber = state.equipment.cyberware;
    document.querySelectorAll(".cyber-toggle")
        .forEach(toggle => {
            toggle.addEventListener("change", e => {
                const pair = e.target.dataset.pair;
                const index = e.target.dataset.index;
                const single = e.target.dataset.singleSlot;
                let slot = null;
                if (single) {
                    const map = {
                        "Кибераудио": "audio",
                        "Нейролинк": "neural"
                    };
                    slot = cyber.slots[map[single]];
                }
                if (pair) {
                    const map = {
                        "Киберглаз": "eyes",
                        "Киберрука": "arms",
                        "Кибернога": "legs"
                    };
                    slot = cyber.slots[map[pair]][index];
                }
                if (!slot) return;
                slot.installed = e.target.checked;
                if (slot.installed && slot.items.length === 0) {
                    slot.items.push({ name: "", desc: "" });
                }
                window.DataPool.CharacterUIStep.renderStep();
            });
        });
    document.querySelectorAll(".cyber-add-item")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                const slotEl = btn.closest(".cyber-slot");
                const toggle = slotEl.querySelector(".cyber-toggle");
                const pair = toggle.dataset.pair;
                const index = toggle.dataset.index;
                const single = toggle.dataset.singleSlot;
                let slot = null;
                if (single) {
                    const map = {
                        "Кибераудио": "audio",
                        "Нейролинк": "neural"
                    };
                    slot = cyber.slots[map[single]];
                }
                if (pair) {
                    const map = {
                        "Киберглаз": "eyes",
                        "Киберрука": "arms",
                        "Кибернога": "legs"
                    };
                    slot = cyber.slots[map[pair]][index];
                }
                if (!slot) return;
                slot.items.push({
                    name: "",
                    desc: ""
                });
                window.DataPool.CharacterUIStep.renderStep();
            });
        });
    document.querySelectorAll("[data-item-name]")
        .forEach(input => {
            input.addEventListener("input", e => {
                const slotEl = input.closest(".cyber-slot");
                const toggle = slotEl.querySelector(".cyber-toggle");
                const pair = toggle.dataset.pair;
                const index = toggle.dataset.index;
                const single = toggle.dataset.singleSlot;
                const itemIndex = Number(e.target.dataset.itemName);
                let slot = null;
                if (single) {
                    const map = {
                        "Кибераудио": "audio",
                        "Нейролинк": "neural"
                    };
                    slot = cyber.slots[map[single]];
                }
                if (pair) {
                    const map = {
                        "Киберглаз": "eyes",
                        "Киберрука": "arms",
                        "Кибернога": "legs"
                    };
                    slot = cyber.slots[map[pair]][index];
                }
                if (!slot) return;
                slot.items[itemIndex].name = e.target.value;
            });
        });
    document.querySelectorAll(".cyber-add-group")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                const groupKey = btn.dataset.group;
                const cyber =
                    window.DataPool.characterState.equipment.cyberware;
                cyber.groups[groupKey].push({
                    name: "",
                    desc: ""
                });
                window.DataPool.CharacterUIStep.renderStep();
            });
        });
    document.querySelectorAll("[data-group-name]")
        .forEach(input => {
            input.addEventListener("input", e => {
                const group = e.target.dataset.group;
                const index = Number(e.target.dataset.groupName);
                const cyber =
                    window.DataPool.characterState.equipment.cyberware;
                cyber.groups[group][index].name = e.target.value;
            });
        });
    document.querySelectorAll("[data-group-desc]")
        .forEach(input => {
            input.addEventListener("input", e => {
                const group = e.target.dataset.group;
                const index = Number(e.target.dataset.groupDesc);
                const cyber =
                    window.DataPool.characterState.equipment.cyberware;
                cyber.groups[group][index].desc = e.target.value;
            });
        });
}

window.DataPool.CharSteps.cyberware =
    window.DataPool.CharSteps.cyberware || {};
window.DataPool.CharSteps.cyberware.bind = bindCyberwareInputs;
