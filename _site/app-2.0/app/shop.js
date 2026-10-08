(() => {
  const modal = document.getElementById("item-modal");
  if (!modal) return;

  const titleEl = document.getElementById("item-modal-title");
  const categoryEl = document.getElementById("item-modal-category");
  const statsEl = document.getElementById("item-modal-stats");
  const bodyEl = document.getElementById("item-modal-body");

  // label: string | { label, span? }
  // span — сколько ячеек сетки занимает блок (по умолчанию 1)
  const STAT_LABELS = {
    skill: "Навык",
    damage: "Урон",
    magazine: "Магазин",
    rof: "ROF",
    hands: "Руки",
    modSlots: "Слоты модов",
    fits: { label: "Подходит для", span: 2 },
    exot: "Тип оружия",
    concealable: "Скрыть",
    features: { label: "Особенности", span: 2 },
    example: "Примеры",
    price: "Цена",
    availability: "Доступность",
    priceNote: "Примечание к цене",
    source: "Источник",
    sp: "ОС",
    bodyPart: "Часть тела",
    penalty: "Штрафы",
    style: "Стиль",
    brand: "Бренд",
    humanity: "ПЧ",
    install: "Установка",
    type: "Тип",
    stats: { label: "Характеристики", span: 2 },
    exoskeleton: "Экзоскелет",
    shell: "Оболочка",
    weapons: { label: "Бортовое вооружение", span: 2 },
    cyberware: { label: "Бортовые импланты", span: 2 },
    options: { label: "Подходит", span: 2 },
  };

  function getStatMeta(entry) {
    if (typeof entry === "string") return { label: entry, span: 1 };
    return {
      label: entry.label || "",
      span: Math.max(1, Number(entry.span) || 1),
    };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderStats(stats) {
    if (!stats) {
      statsEl.innerHTML = "";
      return;
    }
    statsEl.innerHTML = Object.entries(STAT_LABELS)
      .filter(([key]) => stats[key])
      .map(([key, entry]) => {
        const { label, span } = getStatMeta(entry);
        const spanClass = span > 1 ? ` detail-stat--span-${span}` : "";
        return `<div class="detail-stat${spanClass}"><span>${label}</span><strong>${escapeHtml(
          String(stats[key])
        )}</strong></div>`;
      })
      .join("");
  }

  function openItem(btn) {
    const slug = btn.dataset.slug;
    const tpl = document.getElementById(`item-tpl-${slug}`);
    if (!tpl) return;

    const clone = tpl.content.cloneNode(true);
    const statsNode = clone.querySelector(".item-stats");
    let stats = {};
    try {
      stats = JSON.parse(statsNode?.textContent || "{}");
    } catch {
      stats = {};
    }
    statsNode?.remove();

    titleEl.textContent = btn.dataset.title || "";
    categoryEl.textContent = btn.dataset.categoryLabel || "";
    renderStats(stats);
    bodyEl.replaceChildren(clone);

    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
  }

  function closeModal() {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  }

  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-item-open]");
    if (openBtn) {
      openItem(openBtn);
      return;
    }
    if (e.target.closest("[data-close-modal]")) closeModal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.open) closeModal();
  });

  function getCatalogRoot(el) {
    return el.closest("[data-catalog]") || el.closest(".content") || document;
  }

  function getActivePropFilters(catalog) {
    const selected = {};
    catalog.querySelectorAll("[data-filter-key]").forEach((group) => {
      const key = group.dataset.filterKey;
      if (!key) return;
      const values = [...group.querySelectorAll("[data-filter-value]:checked")].map(
        (input) => input.value
      );
      if (values.length) selected[key] = values;
    });
    return selected;
  }

  function updateFilterBadge(catalog) {
    const badge = catalog.querySelector("[data-catalog-filters-badge]");
    if (!badge) return;
    const count = Object.values(getActivePropFilters(catalog)).reduce(
      (sum, values) => sum + values.length,
      0
    );
    badge.hidden = count === 0;
    badge.textContent = String(count);
  }

  function applyCatalogFilters(root) {
    const catalog = root.matches?.("[data-catalog]")
      ? root
      : root.querySelector?.("[data-catalog]") || root;
    const input = catalog.querySelector("[data-catalog-filter]");
    const countEl = catalog.querySelector("[data-catalog-count]");
    const grid = catalog.querySelector("[data-catalog-grid]");
    if (!grid) return;

    const q = (input?.value || "").trim().toLowerCase();
    const activeTab = catalog.querySelector(".shop-tab.is-active");
    const category = activeTab?.dataset.category || "*";
    const propFilters = getActivePropFilters(catalog);

    let visible = 0;
    grid.querySelectorAll(".weapon-card").forEach((card) => {
      const hay = card.dataset.search || "";
      const cardCats = (card.dataset.category || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      const matchCat =
        category === "*" ||
        cardCats.includes(category) ||
        (!cardCats.length && (card.dataset.category || "") === category);
      const matchText = !q || hay.includes(q);
      const matchProps = Object.entries(propFilters).every(([key, values]) => {
        const cardValue = card.getAttribute(`data-f-${key}`) || "";
        return values.includes(cardValue);
      });
      const show = matchCat && matchText && matchProps;
      card.hidden = !show;
      if (show) visible++;
    });
    if (countEl) countEl.textContent = String(visible);
    updateFilterBadge(catalog);
  }

  document.querySelectorAll("[data-catalog]").forEach((catalog) => {
    const tabs = catalog.querySelectorAll(".shop-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => {
          t.classList.toggle("is-active", t === tab);
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });
        applyCatalogFilters(catalog);
      });
    });

    const input = catalog.querySelector("[data-catalog-filter]");
    input?.addEventListener("input", () => applyCatalogFilters(catalog));

    const filterToggle = catalog.querySelector("[data-catalog-filters-toggle]");
    const filterPanel = catalog.querySelector("[data-catalog-filters]");
    if (filterToggle && filterPanel) {
      filterToggle.addEventListener("click", () => {
        const open = filterPanel.hasAttribute("hidden");
        if (open) filterPanel.removeAttribute("hidden");
        else filterPanel.setAttribute("hidden", "");
        filterToggle.setAttribute("aria-expanded", open ? "true" : "false");
      });

      filterPanel.addEventListener("change", (e) => {
        if (e.target.matches("[data-filter-value]")) applyCatalogFilters(catalog);
      });

      catalog
        .querySelector("[data-catalog-filters-reset]")
        ?.addEventListener("click", () => {
          filterPanel
            .querySelectorAll("[data-filter-value]")
            .forEach((input) => {
              input.checked = false;
            });
          applyCatalogFilters(catalog);
        });

      document.addEventListener("click", (e) => {
        if (e.target.closest(".shop-filter")) return;
        if (filterPanel.hasAttribute("hidden")) return;
        filterPanel.setAttribute("hidden", "");
        filterToggle.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Article / modal tabs (clothes, acpa rules, item bodies)
  // Delegation: modal content is cloned from <template> after load.
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab-button[data-tab]");
    if (!btn) return;
    const bar = btn.closest(".tab-buttons");
    if (!bar) return;

    const id = btn.dataset.tab;
    const root = bar.parentElement;
    if (!root) return;

    bar.querySelectorAll(".tab-button").forEach((b) => {
      b.classList.toggle("active", b === btn);
    });
    root.querySelectorAll(".tab-content").forEach((panel) => {
      panel.classList.toggle("active", panel.id === id);
    });
  });
})();
