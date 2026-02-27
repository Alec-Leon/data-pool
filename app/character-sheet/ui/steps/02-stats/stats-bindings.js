window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function bindStatInputs() {
    const state = window.DataPool.characterState;
    document.querySelectorAll("[data-stat]")
        .forEach(input => {

            input.addEventListener("input", e => {
                const key = e.target.dataset.stat;
                state.stats[key] = e.target.value;
            });
        });
}

window.DataPool.CharSteps.stats =
    window.DataPool.CharSteps.stats || {};
window.DataPool.CharSteps.stats.bind = bindStatInputs;
