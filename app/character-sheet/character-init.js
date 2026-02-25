(function () {

    window.DataPool = window.DataPool || {};

    let initialized = false;

    window.DataPool.initCharacterModule = function () {

        if (initialized) return;

        const container = document.getElementById("charlist");
        if (!container) return;

        window.DataPool.CharacterUI.render(container);

        initialized = true;
    };

})();