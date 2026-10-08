document.addEventListener("DOMContentLoaded", () => {
    const main = document.getElementById("main-content");

    const loadPage = async (url, push = true) => {
        try {
            const res = await fetch(url);
            const text = await res.text();
            const doc = new DOMParser().parseFromString(text, "text/html");
            const newMain = doc.getElementById("main-content");
            const newTitle = doc.querySelector("title");

            if (newMain) {
                main.innerHTML = newMain.innerHTML;
                document.title = newTitle ? newTitle.innerText : document.title;

                if (push) history.pushState(null, "", url);

                // Поддержка якорей
                const hash = url.split("#")[1];

                setTimeout(() => {
                    if (hash) {
                        const anchor = document.getElementById(decodeURIComponent(hash));
                        if (anchor) {
                            anchor.scrollIntoView({ behavior: "smooth" });
                        }
                    } else {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }

                    // Инициализация интерактива на странице
                    initPageScripts();
                }, 0);
            }
        } catch (err) {
            console.error("Ошибка загрузки страницы:", err);
            location.href = url;
        }
    };

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

        // Не перехватываем якорные ссылки на текущей странице
        if (link.hash && link.pathname === location.pathname) {
            return;
        }

        e.preventDefault();
        loadPage(link.href);
    });

    window.addEventListener("popstate", () => {
        loadPage(location.href, false);
    });

    initPageScripts();
});
