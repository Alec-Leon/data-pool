window.DataPool.initCharacterModule = function () {
    const container = document.getElementById("charlist-mode");
    if (!container) return;
    if (container.dataset.initialized) return;
    window.DataPool.CharacterUI.render(container);
    container.dataset.initialized = "true";
};