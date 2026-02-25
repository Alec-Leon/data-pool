(function () {

    window.DataPool = window.DataPool || {};

    let currentStep = 0;

    const STEPS = [
        "info",
        "stats",
        "skills",
        "equipment",
        "summary"
    ];

    function renderCharacterLayout() {

        const container =
            document.querySelector("#charlist .character-root");

        if (!container) return;

        container.innerHTML = `
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

        const step = STEPS[currentStep];

        switch (step) {
            case "info":
                renderInfoStep(content);
                break;
            case "stats":
                renderStatsStep(content);
                break;

            default:
                content.innerHTML = `
                <div class="char-step">
                    <h2>${getStepLabel(step)}</h2>
                    <p>Контент шага появится здесь.</p>
                </div>
            `;
        }

        updateActiveButton();
    }

    function renderInfoStep(container) {

        const state = window.DataPool.characterState;

        container.innerHTML = `
        <div class="char-step">
            <h2>Информация о персонаже</h2>
            <div class="char-form">
                <label>
                    Имя персонажа
                    <input type="text"
                        id="char-name"
                        value="${state.name || ''}">
                </label>
                <label>
                    Роль
                    <input type="text"
                        id="char-role"
                        value="${state.role || ''}">
                </label>
                <label>
                    Уровень роли
                    <input type="number"
                        id="char-role-level"
                        value="${state.roleLevel || ''}">
                </label>
            </div>
        </div>
    `;
        bindInfoInputs();
    }

    function renderStatsStep(container) {

        const state = window.DataPool.characterState;

        container.innerHTML = `
        <div class="char-step">
            <h2>Характеристики</h2>

            <div class="char-stats-grid">
                ${CORE_STATS.map(stat => `
                    <label class="stat-field">
                        <span>${STAT_LABELS[stat]}</span>
                        <input
                            type="number"
                            data-stat="${stat}"
                            value="${state.stats[stat] || ''}"
                        >
                    </label>
                `).join("")}
            </div>
        </div>
    `;
        bindStatInputs();
    }

    function bindInfoInputs() {
        const state = window.DataPool.characterState;
        document.getElementById("char-name")
            ?.addEventListener("input", e => {
                state.name = e.target.value;
            });
        document.getElementById("char-role")
            ?.addEventListener("input", e => {
                state.role = e.target.value;
            });
        document.getElementById("char-role-level")
            ?.addEventListener("input", e => {
                state.roleLevel = e.target.value;
            });
    }

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

    function updateActiveButton() {
        document.querySelectorAll(".char-step-btn")
            .forEach((btn, i) => {
                btn.classList.toggle("active", i === currentStep);
            });
    }

    window.DataPool.renderCharacterUI = renderCharacterLayout;

})();