---
title: Мастерская
layout: base.njk
---
<a href="{{ '/' | url }}" class="return-link">На Главную</a>
# Мастерская

<div class="tile-grid">
  <a href="{{ '/workshop/garage/' | url }}" class="tile-button">
    <img src="{{ '/images/content/workshop/garage.png' | url }}" alt="Гараж" />
    <span>Гараж</span>
  </a>
  <a href="{{ '/workshop/repair/' | url }}" class="tile-button">
    <img src="{{ '/images/content/workshop/repair.png' | url }}" alt="Обслуживание Снаряги" />
    <span>Обслуживание Снаряги</span>
  </a>
  <a href="{{ '/workshop/drones/' | url }}" class="tile-button">
    <img src="{{ '/images/content/workshop/drones.png' | url }}" alt="Дроны" />
    <span>Дроны</span>
  </a>
  <a href="{{ '/workshop/upgrades/' | url }}" class="tile-button">
    <img src="{{ '/images/content/workshop/big-gear.png' | url }}" alt="Техапгрейды" />
    <span>Техапгрейды</span>
  </a>
</div>