window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function renderSkillsStep(container) {
    const state = window.DataPool.characterState;
    container.innerHTML = `
        <div class="char-step">
            <h2>Навыки</h2>
            <div class="char-skills-layout">
                ${Object.entries(SKILL_GROUP_LABELS)
        .map(([groupKey, label]) =>
            renderSkillGroup(groupKey, label, state)
        )
        .join("")}
            </div>
        </div>
    `;
}

function renderSkillGroup(groupKey, label, state) {
    const group = state.skills[groupKey] || {};
    const skills = SKILL_GROUPS[groupKey] || [];
    const items = skills.map(skillKey => {
        const skillLabel = SKILL_LABELS[skillKey];
        const value = group[skillKey] ?? '';
        return `
            <div class="skill-row">
                <span class="skill-name">${skillLabel}</span>
                <input
                    type="number"
                    class="skill-input"
                    data-skill-group="${groupKey}"
                    data-skill="${skillKey}"
                    value="${value}"
                >
            </div>
        `;
    }).join("");
    return `
        <div class="skill-group-block">
            <h3 class="skill-group-title">${label}</h3>

            <div class="skill-group-grid">
                ${items}
            </div>
        </div>
    `;
}

window.DataPool.CharSteps.skills =
    window.DataPool.CharSteps.skills || {};
window.DataPool.CharSteps.skills.render = renderSkillsStep;
