(function () {

    window.DataPool = window.DataPool || {};
    window.DataPool.CharSteps = window.DataPool.CharSteps || {};
    window.DataPool.CharacterUI = {};

    let currentStep = 0;

    const STEPS = [
        "info",
        "stats",
        "skills",
        "equipment",
        "cyberware",
        "summary"
    ];

    function renderCharacterLayout(container) {
        if (!container) {
            console.warn("CharacterUI: container missing");
            return;
        }
        container.innerHTML = `
        <div class="character-root">
            <div class="character-sheet">
                <div class="char-steps-nav">
                    ${STEPS.map((s, i) => `
                        <button class="char-step-btn"
                            data-step="${i}">
                            ${getStepLabel(s)}
                        </button>
                    `).join("")}
                </div>
                <div id="char-step-content"></div>
            </div>
        </div>
    `;
        bindStepButtons();
        renderStep();
    }

    function getStepLabel(step) {
        return {
            info: "Инфо",
            stats: "Статы",
            skills: "Навыки",
            equipment: "Снаряжение",
            cyberware: "Киберимпланты",
            summary: "Итог"
        }[step];
    }

    function bindStepButtons() {
        document.querySelectorAll(".char-step-btn")
            .forEach(btn => {
                btn.addEventListener("click", () => {
                    currentStep = Number(btn.dataset.step);
                    renderStep();
                });
            });
    }

    function renderStep() {
        const content = document.getElementById("char-step-content");

        const stepKey = STEPS[currentStep];
        const step = window.DataPool.CharSteps[stepKey];

        if (!step) {
            content.innerHTML = `
                <div class="char-step">
                    <h2>${getStepLabel(stepKey)}</h2>
                    <p>Контент шага появится здесь.</p>
                </div>
            `;
            return;
        }
        step.render(content)
        step.bind?.()
        updateActiveButton();
    }

    function updateActiveButton() {
        document.querySelectorAll(".char-step-btn")
            .forEach((btn, i) => {
                btn.classList.toggle("active", i === currentStep);
            });
    }

    window.DataPool.CharacterUI.render = renderCharacterLayout;
    window.DataPool = window.DataPool || {};
    window.DataPool.CharacterUIStep = {
        renderStep
    }
})();
