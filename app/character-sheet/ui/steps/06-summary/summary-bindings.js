window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function bindSummaryStep() {
    document.getElementById("summary-role-link")
        ?.addEventListener("click", () => {
            const state = window.DataPool.characterState;
            const role = window.DataPool.ROLES?.[state.role];
            if (role?.link) {
                window.DataPool.openDataPoolArticle(role.link);
            }
        });
    document.getElementById("summary-export-pdf-btn")
        ?.addEventListener("click", () => {
            window.DataPool.exportCharacterSheetPdf?.();
        });
    document.getElementById("summary-export-foundry-btn")
        ?.addEventListener("click", () => {
            window.alert("Извините, пока не работает");
        });
}

window.DataPool.CharSteps.summary =
    window.DataPool.CharSteps.summary || {};
window.DataPool.CharSteps.summary.bind = bindSummaryStep;
