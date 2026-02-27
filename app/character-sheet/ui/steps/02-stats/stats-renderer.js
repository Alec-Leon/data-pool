window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function renderStatsStep(container) {
    const state = window.DataPool.characterState;
    const derived = ["hp","wound","save","humanity"];
    const corePairs = [
        ["int","ref"],
        ["dex","tech"],
        ["char","will"],
        ["luck","spd"],
        ["body","emp"]
    ];

    container.innerHTML = `
        <div class="char-step">
            <h2>Характеристики</h2>
            <div class="derived-grid">
                ${derived.map(stat => statField(stat,state)).join("")}
            </div>
            <div class="core-grid">
                ${corePairs.map(pair => `
                    <div class="core-row">
                        ${statField(pair[0],state)}
                        ${statField(pair[1],state)}
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function statField(stat, state) {
    return `
        <div class="stat-field">
            <span>${STAT_LABELS[stat]}</span>
            <input
                type="number"
                data-stat="${stat}"
                value="${state.stats[stat] || ''}"
            >
        </div>
    `;
}

window.DataPool.CharSteps.stats =
    window.DataPool.CharSteps.stats || {};
window.DataPool.CharSteps.stats.render = renderStatsStep;
