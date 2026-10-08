# Data Pool 2.0 — гайд для агентов

Документ для людей и агентов, которые продолжают рефакторинг. Читать **до** правок в `app-2.0/`.

## Статус

- **1.x (прод)** живёт в корне: `content/`, `templates/`, `css/`, `app/`, `.eleventy.js`.
- **2.0 (прототип)** живёт в `app-2.0/`, собирается отдельно, основной сайт не трогает.
- Цель 2.0: та же технология (Eleventy 3 + Nunjucks + markdown-it + plain CSS), другая **информационная архитектура и UX**.
- **Раздел `/equipment/` полностью перенесён** в формат 2.0 (каталоги + справочники).

Не смешивать деревья: правки контента 1.x ≠ правки `app-2.0/`, пока явно не попросили cutover.

---

## Как собрать и открыть

| Команда | Что делает |
|---------|------------|
| `npm run serve:v2` | Dev-сервер 2.0 |
| `npm run build:v2` | Сборка в `_site/app-2.0/` |
| `npm run migrate:weapons-v2` | Оружие: `weapons.md` → items |
| `npm run migrate:equipment-v2` | Броня, предметы, агенты, софт, ACPA-костюмы |
| `npm run migrate:v2` | Оба мигратора подряд |
| `npm run serve` / `build` | Старый сайт |

URL: `http://localhost:8080/data-pool/app-2.0/equipment/`

Конфиг: `.eleventy.app-2.0.js` · `pathPrefix`: `/data-pool/app-2.0/` · output: `_site/app-2.0`

---

## Раздел Снаряжение (готово)

| Раздел | URL | Формат | Кол-во атомов |
|--------|-----|--------|---------------|
| Хаб | `/equipment/` | плитки-ссылки | — |
| Оружие | `/equipment/weapons/` | card → modal | ~300 |
| Броня | `/equipment/armor/` | lore + card → modal | ~32 |
| Предметы | `/equipment/items/` | card → modal | ~126 |
| Агенты | `/equipment/agents/` | intro + card → modal | ~10 |
| Софт | `/equipment/soft/` | card → modal | ~20 |
| Одежда и стиль | `/equipment/clothes-style/` | **справочник** (таблицы, вкладки) | — |
| Силовая броня | `/equipment/acpa/` | правила (вкладки) + card → modal на костюмы | ~10 |

**Справочники** (не card-grid): `clothes-style` целиком; у ACPA — вкладки правил/сборки/боя, каталог только на «Готовые варианты».

---

## UX-паттерн 2.0

1. **Одна единица = один `.md`** в `…/items/` со статами в front matter и описанием в body.
2. **Витрина** (`.njk` или `.md` с njk) — карточки, категории, поиск.
3. **Клик** → `<dialog id="item-modal">` с статами + полным markdown.
4. **Permalink off**: `items.11tydata.js` → `permalink: false`, `layout: false`. Контент вшивается в витрину через `<template id="item-tpl-<slug}">`.

Общий макрос: `app-2.0/templates/includes/macros/catalog.njk`  
JS: `app-2.0/app/shop.js` (каталог + модалка + article tabs)

---

## Структура

```
app-2.0/
├── content/
│   ├── index.md
│   └── equipment/
│       ├── index.njk                 # хаб
│       ├── weapons/index.njk + items/*.md
│       ├── armor/index.njk + items/*.md
│       ├── items/index.njk + items/*.md
│       ├── agents/index.njk + items/*.md
│       ├── soft/index.njk + items/*.md
│       ├── clothes-style/index.md    # справочник
│       └── acpa/index.md + items/*.md
├── templates/
│   ├── layouts/base.njk
│   └── includes/
│       ├── armor-lore.html
│       └── macros/catalog.njk
├── css/   (main, shop, modal)
├── app/shop.js
└── data/site.json
```

Скрипты:

- `scripts/migrate-weapons-v2.js`
- `scripts/migrate-equipment-v2.js`
- `scripts/lib/migrate-utils.js`

---

## Контракт атома (общий)

```yaml
---
title: "…"
permalink: false
tags: "weapons"          # или armor | gear | agents | soft | acpa
category: "…"            # id вкладки
categoryLabel: "…"
categoryOrder: "10"
slug: "unique-slug"
# далее статы раздела (price, damage, sp, brand, …)
---

Описание (markdown body).
```

YAML-значения **всегда в кавычках**. Уникальный `slug`. Статы для модалки подхватываются фильтром `catalogStats` (см. `.eleventy.app-2.0.js`).

### Карточка по разделам

| Раздел | Поля на карточке |
|--------|------------------|
| Оружие | урон, ROF, навык, цена |
| Броня | ОС, часть тела, штрафы, цена |
| Предметы | цена |
| Агенты | тип, ПЧ, установка, цена |
| Софт | бренд, цена |
| ACPA | статы-строка, экзоскелет, цена (+ картинка) |

---

## Коллекции Eleventy

Хелпер `makeCatalogCollections(name, glob)` создаёт:

- `collections.<name>`
- `collections.<name>Categories`

Имена: `weapons`, `armor`, `gear` (предметы!), `agents`, `soft`, `acpa`.

В шаблоне: `collections.weaponsCategories`, `collections.gearCategories`, и т.д.

---

## Принципы (для следующих разделов)

1. Движок не меняем.
2. Каталожные сущности — атомы `.md`.
3. Витрина ≠ статья; детали — модалка.
4. Permalink off для атомов по умолчанию.
5. 1.x — источник правды до cutover; миграторы > копипаст таблиц.
6. UI только в `app-2.0/css`.
7. Витрины с разметкой — **`.njk`**. Статьи с markdown-таблицами — **`.md`** + njk (`markdownTemplateEngine: njk`). Не оставлять markdown-синтаксис в чистом `.njk`.
8. Многострочный HTML с `>` на отдельной строке в `.md` ломает markdown → кнопки в одну строку.

### Критерий готовности раздела

- [ ] Атомы в `items/*.md`
- [ ] Витрина / справочник на месте
- [ ] Модалка (если каталог)
- [ ] Нет HTML для items в `_site`
- [ ] `npm run build:v2` зелёный
- [ ] 1.x файл не удалён без согласования

---

## Частые ловушки

1. Править 1.x и ждать 2.0 → нужен `migrate:*` или правка item-файла.
2. Витрина `.md` с многострочным HTML → ломается; использовать `.njk`.
3. Забыть кавычки в YAML.
4. Дать items layout/permalink.
5. Трогать корневой `.eleventy.js` для 2.0.
6. Перепутать `gear` (коллекция предметов) с путём `equipment/items/`.
7. `weaponsCategories` ≠ `weaponCategories`.

---

## Быстрый чеклист агенту

```
Задача про 2.0 / equipment?
  → app-2.0/ (+ .eleventy.app-2.0.js, scripts/*-v2*)
  → эталон: equipment/weapons (macro catalog + dialog)
  → новый каталог: скопировать weapons/armor схему + коллекцию в конфиге
  → npm run build:v2
```
