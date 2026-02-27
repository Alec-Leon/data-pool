window.DataPool = window.DataPool || {};

/* =========================
   SPA NAVIGATION
========================= */

export async function loadPage(url, push = true) {
    const main = document.getElementById("main-content");

    try {
        const res = await fetch(url);
        const text = await res.text();

        const doc = new DOMParser().parseFromString(text, "text/html");
        const newMain = doc.getElementById("main-content");
        const newTitle = doc.querySelector("title");

        if (newMain) {
            main.innerHTML = newMain.innerHTML;
            document.title = newTitle
                ? newTitle.innerText
                : document.title;

            if (push) history.pushState(null, "", url);

            const hash = url.split("#")[1];

            setTimeout(() => {
                if (hash) {
                    const anchor = document.getElementById(
                        decodeURIComponent(hash)
                    );
                    anchor?.scrollIntoView({ behavior: "smooth" });
                } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }

                window.initPageScripts?.();
            }, 0);
        }

    } catch (err) {
        console.error("SPA load error:", err);
        location.href = url;
    }
}

window.DataPool.loadPage = loadPage;

document.addEventListener("DOMContentLoaded", () => {

    document.body.addEventListener("click", e => {
        const link = e.target.closest("a");

        if (
            !link ||
            link.hostname !== location.hostname ||
            link.target === "_blank" ||
            link.hasAttribute("download") ||
            link.hasAttribute("data-no-spa")
        ) {
            return;
        }

        if (link.hash && link.pathname === location.pathname) {
            return;
        }

        e.preventDefault();
        loadPage(link.href);
    });

    window.addEventListener("popstate", () => {
        loadPage(location.href, false);
    });

    window.initPageScripts = function () {
        console.log("[SPA] reinit");
        window.initTabs?.();
    };
});
