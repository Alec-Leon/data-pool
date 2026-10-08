let ENEMIES_INDEX = null;
const DEFAULT_ICONS = {
    helmet: 'images/content/enemies/helmet-icons/default-helmet.png',
    armor:  'images/content/enemies/armor-icons/default-armor.png',
    weapon: 'images/content/enemies/weapon-icons/default-range-weapon.png',
    item:   'images/content/enemies/item-icons/default-item.png',
};

async function loadEnemiesIndex() {
    if (ENEMIES_INDEX) return ENEMIES_INDEX;

    const url = window.__BASE_PATH__ + "data/enemies/enemies-list.json";
    console.log("Fetching enemies index from:", url);

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Не удалось загрузить enemies.json: " + res.status);
    }

    ENEMIES_INDEX = await res.json();
    console.log("Enemies index:", ENEMIES_INDEX);
    return ENEMIES_INDEX;
}

async function loadEnemyFile(path) {
    const cleanPath = path.replace(/^\//, "");
    const url = window.__BASE_PATH__ + cleanPath;
    console.log("Fetching enemy file:", url);
    const res = await fetch(url);
    if (!res.ok) {
        console.error("Enemy file fetch error:", res.status, url);
        return null;
    }
    return await res.json();
}

function buildEnemyTierMenu(data) {
    const tierContainer = document.getElementById("enemy-tier-buttons");
    const typeContainer = document.getElementById("enemy-type-buttons");
    if (!tierContainer || !typeContainer) {
        console.warn("Нет контейнеров enemy-tier-buttons / enemy-type-buttons в разметке");
        return;
    }

    tierContainer.innerHTML = "";
    typeContainer.innerHTML = "";

    const tiers = Array.isArray(data.tiers) ? data.tiers : [];
    if (!tiers.length) {
        console.warn("В enemies.json нет tiers или он пустой", data);
        return;
    }

    tiers.forEach(tier => {
        const btn = document.createElement("button");
        btn.className = "enemy-tier-btn";
        btn.textContent = tier.name || tier.id;

        btn.addEventListener("click", () => {
            tierContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            buildEnemyTypeMenu(tier);
            updateEnemyTierDescription(tier)
        });

        tierContainer.appendChild(btn);
    });

    tierContainer.querySelector("button")?.classList.add("active");
    updateEnemyTierDescription(tiers[0])
    buildEnemyTypeMenu(tiers[0]);
}

function buildEnemyTypeMenu(tier) {
    const typeContainer = document.getElementById("enemy-type-buttons");
    const detailsContainer = document.getElementById("enemy-details");
    if (!typeContainer || !detailsContainer) {
        console.warn("Нет enemy-type-buttons / enemy-details");
        return;
    }

    typeContainer.innerHTML = "";
    detailsContainer.innerHTML = "";

    if (!tier || !Array.isArray(tier.types)) {
        console.error("У tier нет поля types", tier);
        return;
    }

    tier.types.forEach(type => {
        const btn = document.createElement("button");
        btn.className = "enemy-type-btn";
        btn.textContent = type.name || type.id;

        btn.addEventListener("click", async () => {
            typeContainer.querySelectorAll("button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const enemy = await loadEnemyFile(type.file);
            if (!enemy) return;

            buildEnemyDetails(enemy);
        });

        typeContainer.appendChild(btn);
    });
    if (tier.types[0]) {
        typeContainer.querySelector("button")?.classList.add("active");

        (async () => {
            const enemy = await loadEnemyFile(tier.types[0].file);
            if (enemy) buildEnemyDetails(enemy);
        })();
    }
}

function buildEnemyDetails(enemy) {
    const container = document.getElementById("enemy-details");

    if (!enemy || !enemy.stats) {
        console.error("buildEnemyDetails: enemy без stats", enemy);
        container.innerHTML = "<p>Ошибка: нет данных по врагу.</p>";
        return;
    }

    container.innerHTML = `
        <h1 class="">${enemy.name}</h1>
        <div class="enemy-layout">
            <div class="enemy-column stats-column">
            <div class="enemy-card">
                <h3 class="column-name">Характеристики</h3>
                ${renderEnemyStatsBlock(enemy)}
            </div>
            ${renderEnemyRole(enemy)}
            ${renderEnemyCyberwareBlock(enemy)}
            </div>
    
            <div class="enemy-main">
                <div class="enemy-column center-column">
                     <div class="enemy-card">
                         <div class="silhouette-box">
                              <h3 class="column-name">Снаряжение</h3>
                              <div class="silhouette-wrapper">
                                <div class="slot slot-head empty"></div>
                                <div class="slot slot-body empty"></div>
                                <div class="slot slot-hand left empty"></div>
                                <div class="slot slot-hand right empty"></div>
                                <div class="extra-weapons left"></div>
                                <div class="extra-weapons right"></div>
                                <img class="silhouette-img" src="${window.__BASE_PATH__}images/content/enemies/silhouette.png">
                              </div>
                              <div class="inventory-grid"></div>
                         </div>
                     </div>
                </div>
    
                <div class="enemy-column skills-column">
                    <div class="enemy-card">
                        <h3 class="column-name">Навыки</h3>
                        <div class="skills-hint">
                            Здесь указана Основа Навыка<br>
                            (СТАТ + Навык)
                        </div>
                        <div class="skills-list">
                            ${renderEnemySkills(enemy.skills)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    fillEnemyEquipment(enemy);
    fillEnemyInventory(enemy);
}

function renderEnemyStatsBlock(enemy) {
    const stats = enemy?.stats;
    if (!stats) return '';

    return `
    <div class="enemy-stats-block">
      ${renderPrimaryStats(stats)}
      <div class="stats-divider"></div>
      ${renderAttributes(stats)}
    </div>
  `;
}

function renderEnemySkills(skills) {
    if (!skills) return '';

    return Object.keys(SKILL_GROUP_LABELS)
        .map(groupKey => {
            return renderSkillGroup(groupKey, skills[groupKey]);
        })
        .join('');
}

function fillEnemyInventory(enemy) {
    const grid = document.querySelector('.inventory-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const items = enemy?.equipment?.gear ?? [];

    items.forEach(item => {
        const slot = document.createElement('div');
        slot.className = 'slot';

        setSlot(slot, {
            icon: item.icon ?? null,
            stat: item.count != null ? `x${item.count}` : '',
            name: item.name ?? '',
            type: 'item',
        });

        grid.appendChild(slot);
    });
    const maxPerRow = 4;
    const remainder = items.length % maxPerRow;
    const emptyCount = remainder === 0 ? 0 : maxPerRow - remainder;

    for (let i = 0; i < emptyCount; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.className = 'slot empty';
        grid.appendChild(emptySlot);
    }
}

function escapeHtml(s) {
    return String(s)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function fillEnemyEquipment(enemy) {
    const eq = enemy?.equipment;
    if (!eq) return;

    // --- ШЛЕМ ---
    setSlot(document.querySelector('.slot-head'), {
        icon: eq.helmet?.icon ?? null,
        stat: eq.helmet?.value ?? '',
        name: eq.helmet?.name ?? '',
        type: "helmet"
    });

    // --- БРОНЯ ---
    setSlot(document.querySelector('.slot-body'), {
        icon: eq.armor?.icon ?? null,
        stat: eq.armor?.value ?? '',
        name: eq.armor?.name ?? '',
        type: "armor"
    });

    const weapons = eq.weapons ?? [];
    const rightHand = document.querySelector('.slot-hand.right');
    const leftHand  = document.querySelector('.slot-hand.left');
    const extraRight = document.querySelector('.extra-weapons.right');
    const extraLeft  = document.querySelector('.extra-weapons.left');
    if (extraRight) extraRight.innerHTML = '';
    if (extraLeft)  extraLeft.innerHTML = '';

    // --- ОСНОВНЫЕ РУКИ ---
    setSlot(leftHand,  weaponData(weapons[0]));
    setSlot(rightHand, weaponData(weapons[1]));

    // --- ДОПОЛНИТЕЛЬНЫЕ ОРУЖИЯ ---
    weapons.slice(2).forEach((weapon, index) => {
        const slot = document.createElement('div');
        slot.className = 'slot';
        setSlot(slot, weaponData(weapon));
        if (index % 2 === 0) {
            extraLeft?.appendChild(slot);
        } else {
            extraRight?.appendChild(slot);
        }
    });
}

function weaponData(w) {
    if (!w) return {};
    return {
        icon: w.icon ?? null,
        stat: w.dmg ?? '',
        name: w.name ?? '',
        type: "weapon",
        link: w.link ?? ''
    };
}

let __slotTooltipEl = null;

function ensureSlotTooltip() {
    if (__slotTooltipEl) return __slotTooltipEl;
    const el = document.createElement('div');
    el.className = 'item-tooltip';
    el.style.display = 'none';
    document.body.appendChild(el);
    __slotTooltipEl = el;
    return el;
}

function showSlotTooltip(e, slotEl) {
    const name = slotEl.dataset.itemName || '';
    const link = slotEl.dataset.itemLink || '';
    if (!name) return;

    const tip = ensureSlotTooltip();
    tip.innerHTML = `
    <div class="item-name">${escapeHtml(name)}</div>
    ${link ? `<a class="item-link" href="${escapeHtml(link)}" target="_blank" rel="noopener">Открыть в DataPool</a>` : ``}
  `;
    tip.style.display = 'block';
    moveSlotTooltip(e);
}

function moveSlotTooltip(e) {
    if (!__slotTooltipEl) return;
    __slotTooltipEl.style.left = (e.clientX + 12) + 'px';
    __slotTooltipEl.style.top = (e.clientY + 12) + 'px';
}

function hideSlotTooltip() {
    if (!__slotTooltipEl) return;
    __slotTooltipEl.style.display = 'none';
}

/**
 * slotEl: элемент .slot...
 * data:
 *  - icon: путь
 *  - stat: строка для угла
 *  - name: название для tooltip
 *  - link: ссылка для tooltip (опционально)
 *  - type: тип для выбора дефолтной иконки
 */
function setSlot(
    slotEl,
    {
        icon = null,
        stat = '',
        name = '',
        link = '',
        type = '',
    } = {}
) {
    if (!slotEl) return;

    slotEl.dataset.itemName = name || '';
    slotEl.dataset.itemLink = link || '';

    let finalIcon = icon;

    if (!finalIcon && DEFAULT_ICONS[type]) {
        finalIcon = DEFAULT_ICONS[type];
    }

    if (!finalIcon && !stat && !name) {
        slotEl.classList.add('empty');
        slotEl.innerHTML = '';
    } else {
        slotEl.classList.remove('empty');

        const src = finalIcon
            ? (finalIcon.startsWith('http')
                ? finalIcon
                : window.__BASE_PATH__ + finalIcon.replace(/^\//, ''))
            : null;

        slotEl.innerHTML = `
      ${src ? `<img src="${escapeHtml(src)}" alt="">` : ``}
      ${stat ? `<div class="stat">${escapeHtml(String(stat))}</div>` : ``}
    `;
    }

    if (!slotEl._tooltipBound) {
        slotEl._tooltipBound = true;
        slotEl.addEventListener('mouseenter', (e) => showSlotTooltip(e, slotEl));
        slotEl.addEventListener('mousemove', moveSlotTooltip);
        slotEl.addEventListener('mouseleave', hideSlotTooltip);
    }
}

function renderPrimaryStats(stats) {
    if (!stats) return '';

    return `
    <div class="enemy-primary-stats">
      ${renderStatPill(STAT_LABELS["hp"], stats.hp)}
      ${renderStatPill(STAT_LABELS["wound"], stats.wound, 'wide')}
      ${renderStatPill(STAT_LABELS["save"], stats.save)}
    </div>
  `;
}

function renderStatPill(label, value, extraClass = '') {
    return `
    <div class="stat-pill ${extraClass}">
      <span class="label">${label}</span>
      <span class="value">${value}</span>
    </div>
  `;
}

const CORE_STATS = [
    'int','ref','dex','tech','char',
    'will','luck','spd','body','emp'
];

function renderAttributes(stats) {
    if (!stats) return '';

    return `
    <div class="enemy-attributes">
      ${CORE_STATS.map(key => `
        <div class="attr">
          <span class="label">${STAT_LABELS[key]}</span>
          <span class="value">${stats[key]}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSkillGroup(groupKey, skills) {
    if (!skills) return '';
    const items = [];
    Object.entries(skills).forEach(([skillKey, value]) => {
        // поднавыки (язык, знание местности и т.п.)
        if (Array.isArray(value)) {
            value.forEach(sub => {
                if (
                    (typeof sub.level === 'number' && sub.level > 0) ||
                    (typeof sub.level === 'string' && sub.level.trim() !== '')
                ) {
                    const label = `${SKILL_LABELS[skillKey]} (${sub.name})`;
                    items.push(renderSkillItem(label, sub.level));
                }
            });
            return;
        }
        // обычный навык
        if (
            (typeof value === 'number' && value > 0) ||
            (typeof value === 'string' && value.trim() !== '')
        ) {
            items.push(renderSkillItem(SKILL_LABELS[skillKey], value));
        }
    });
    if (!items.length) return '';
    return `
        <div class="skill-group">
            <h4 class="skill-group-title">
                ${SKILL_GROUP_LABELS[groupKey]}
            </h4>
            <div class="skill-group-items">
                ${items.join('')}
            </div>
        </div>
    `;
}

function renderSkillItem(label, value) {
    return `
    <div class="skill-item">
      <span class="skill-name">${label}</span>
      <span class="skill-value">${value}</span>
    </div>
  `;
}

function updateEnemyTierDescription(tierData) {
    const desc = document.getElementById("enemy-tier-description");

    if (!tierData || !tierData.description) {
        desc.innerHTML = "";
        return;
    }

    desc.innerHTML = tierData.description
        .split("\n")
        .map(p => `<p>${p}</p>`)
        .join("");
}

function renderEnemyCyberwareBlock(enemy) {
    const list = enemy?.equipment?.cyberware ?? [];
    if (!list.length) return '';

    return `
      <div class="enemy-card cyberware-block">
        <h3 class="column-name">Киберимпланты</h3>
        <ul class="cyberware-list">
            ${list.map(c => `<li>${c.name}</li>`).join("")}
        </ul>
      </div>
    `;
}

function renderEnemyRole(enemy){
    if(!enemy.role) return '';

    return `
    <div class="enemy-card enemy-role">
        <h3 class="column-name">Роль</h3>
        <div class="enemy-role-row">
            <span class="role-name">${enemy.role.name}</span>
            <span class="role-level">УР. ${enemy.role.level}</span>
        </div>
    </div>
    `;
}

async function initEnemiesModule() {
    try {
        const index = await loadEnemiesIndex();
        buildEnemyTierMenu(index);
    } catch (e) {
        console.error("initEnemiesModule error:", e);
    }
}