if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const countdown = document.querySelector("#countdown");

async function run() {
    countdown.setAttribute("run", "");
    for (const elem of document.querySelectorAll(".countdown-text")) {
        elem.setAttribute("show", "");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        elem.removeAttribute("show");
    }
}

alt.on("countdown:show", () => {
    countdown.removeAttribute("hidden");
});

alt.on("countdown:run", run);
