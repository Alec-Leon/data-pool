window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

const LANGUAGE_STREET_FIXED_NAME = "Уличный Слэнг";

function bindSkillInputs() {
    const state = window.DataPool.characterState;

    document
        .querySelectorAll(".skill-input[data-skill]")
        .forEach(input => {
            input.addEventListener("input", e => {
                const group = e.target.dataset.skillGroup;
                const skill = e.target.dataset.skill;
                if (!state.skills[group]) {
                    state.skills[group] = {};
                }
                if (getMultiSkillFieldCount(skill) > 0) return;
                state.skills[group][skill] = e.target.value;
                window.DataPool.SkillsUI?.refreshSpentPointsCounter?.();
            });
        });

    document
        .querySelectorAll(".skill-multi-name-input")
        .forEach(input => {
            input.addEventListener("input", e => {
                const el = e.target;
                const group = el.dataset.skillGroup;
                const skillKey = el.dataset.skillKey;
                const idx = Number(el.dataset.multiIndex);
                if (!state.skills[group] || !skillKey || !Number.isInteger(idx)) return;
                const arr = state.skills[group][skillKey];
                if (!Array.isArray(arr) || !arr[idx]) return;
                if (skillKey === "language" && idx === 0) {
                    arr[0].name = LANGUAGE_STREET_FIXED_NAME;
                    el.value = LANGUAGE_STREET_FIXED_NAME;
                    return;
                }
                arr[idx].name = el.value;
            });
        });

    document
        .querySelectorAll(".skill-multi-level-input")
        .forEach(input => {
            input.addEventListener("input", e => {
                const el = e.target;
                const group = el.dataset.skillGroup;
                const skillKey = el.dataset.skillKey;
                const idx = Number(el.dataset.multiIndex);
                if (!state.skills[group] || !skillKey || !Number.isInteger(idx)) return;
                const arr = state.skills[group][skillKey];
                if (!Array.isArray(arr) || !arr[idx]) return;
                arr[idx].level = el.value;
                window.DataPool.SkillsUI?.refreshSpentPointsCounter?.();
            });
        });
}

window.DataPool.CharSteps.skills =
    window.DataPool.CharSteps.skills || {};
window.DataPool.CharSteps.skills.bind = bindSkillInputs;
