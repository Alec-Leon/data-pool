window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function bindInfoInputs() {
    const state = window.DataPool.characterState;
    const roles = window.DataPool.ROLES || {};
    document.getElementById("char-name")
        ?.addEventListener("input", e => {
            state.name = e.target.value;
        });
    document.getElementById("char-role")
        ?.addEventListener("change", e => {
            state.role = e.target.value;
            window.DataPool.CharacterUIStep.renderStep();
        });
    document.getElementById("char-role-level")
        ?.addEventListener("input", e => {
            state.roleLevel = e.target.value;
        });
    document.getElementById("role-link")
        ?.addEventListener("click", () => {
            const role = roles[state.role];
            if (!role) return;
            window.DataPool.openDataPoolArticle(role.link);
        });
}

window.DataPool.CharSteps.info =
    window.DataPool.CharSteps.info || {};
window.DataPool.CharSteps.info.bind = bindInfoInputs;
