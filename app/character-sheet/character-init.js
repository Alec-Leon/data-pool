(function () {

    window.DataPool = window.DataPool || {};

    let initialized = false;

    function initCharacterModule() {
        if (initialized) return;

        console.log("Character sheet initialized");
        window.DataPool.renderCharacterUI();
        initialized = true;
    }

    window.DataPool.initCharacterModule = initCharacterModule;

})();