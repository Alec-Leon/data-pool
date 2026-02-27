window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function bindSkillInputs() {
    const state = window.DataPool.characterState;
    document
        .querySelectorAll("[data-skill]")
        .forEach(input => {
            input.addEventListener("input", e => {
                const group = e.target.dataset.skillGroup;
                const skill = e.target.dataset.skill;
                if (!state.skills[group]) {
                    state.skills[group] = {};
                }
                state.skills[group][skill] = e.target.value;
            });
        });
}

window.DataPool.CharSteps.skills =
    window.DataPool.CharSteps.skills || {};
window.DataPool.CharSteps.skills.bind = bindSkillInputs;
