if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const hud = document.getElementById("hud");

// alt.on("fade:in", () => {
//     hud.setAttribute("fade", "");
// });

alt.on("fade:out", () => {
    hud.removeAttribute("fade");
});

window.addEventListener("load", () => {
    hud.setAttribute("fade", "");
});
