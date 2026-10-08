const gmScreen = document.getElementById("gm-screen-mode");
const gmContent = document.getElementById("gm-screen-content");

async function loadGMScreen() {
    const response = await fetch(gmScreen.dataset.screenUrl);
    gmContent.innerHTML = await response.text();
    initGmPager()
}

function initGmPager() {
    const container = document.querySelector(".gm-screen-container");
    if (!container) return;
    const pages = [
        `${window.__BASE_PATH__}images/content/gm-screen/screen1.png`,
        `${window.__BASE_PATH__}images/content/gm-screen/screen2.png`,
        `${window.__BASE_PATH__}images/content/gm-screen/screen3.png`,
        `${window.__BASE_PATH__}images/content/gm-screen/screen4.png`
    ];
    let current = 0;
    const counter = container.querySelector("#gm-counter");
    const img = container.querySelector("#gm-screen-page");
    const btnPrev = container.querySelector("#gm-prev");
    const btnNext = container.querySelector("#gm-next");
    if (!counter || !img || !btnPrev || !btnNext) return;
    function update() {
        img.src = pages[current];
        counter.textContent = `${current + 1} / ${pages.length}`;
    }
    btnPrev.addEventListener("click", () => {
        current = (current - 1 + pages.length) % pages.length;
        update();
    });
    btnNext.addEventListener("click", () => {
        current = (current + 1) % pages.length;
        update();
    });
    update();
}