window.DataPool = window.DataPool || {};
window.DataPool.CharSteps = window.DataPool.CharSteps || {};

function renderInfoStep(container) {
    const state = window.DataPool.characterState;
    const roles = window.DataPool.ROLES || {};
    const options = Object.entries(roles)
        .map(([key, r]) => `
            <option value="${key}"
                ${state.role === key ? "selected" : ""}>
                ${r.label}
            </option>
        `).join("");
    const roleData = roles[state.role];
    container.innerHTML = `
        <div class="char-step">
            <h2>Информация о персонаже</h2>
            <div class="char-form">
                <label>
                    Имя персонажа
                    <input id="char-name"
                        type="text"
                        autocomplete="off"
                        value="${state.name || ''}">
                </label>
                <label>
                    Роль
                    <select id="char-role">
                        <option value="">— выбрать —</option>
                        ${options}
                    </select>
                </label>
                <label>
                    Уровень роли
                    <input type="number"
                        id="char-role-level"
                        value="${state.roleLevel || ''}">
                </label>
                ${
        roleData
            ? `
                        <div class="role-info">
                            <strong>Способность:</strong>
                            <p>${roleData.ability}</p>

                            <button id="role-link">
                                Подробнее →
                            </button>
                        </div>`
            : ""
    }
            </div>
        </div>
    `;
}

window.DataPool.CharSteps.info =
    window.DataPool.CharSteps.info || {};
window.DataPool.CharSteps.info.render = renderInfoStep;
