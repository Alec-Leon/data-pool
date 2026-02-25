(function () {
    window.DataPool = window.DataPool || {};
    let initialized = false;
    window.DataPool.initCharacterModule = function () {
        if (initialized) return;
        const root = document.getElementById("charlist");
        if (!root) return;
        console.log("[Character] init");
        window.DataPool.CharacterUI.render(root);
        initialized = true;
    };
})();