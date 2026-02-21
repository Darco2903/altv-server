if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

function getColor(percentage) {
    const red = 255 * (1 - (percentage - 400) / 400);
    const green = 200 * ((percentage - 400) / 400);

    return `rgba(${red}, ${green}, 0, 0.6)`;
}

alt.on("tyres:update", (index, wear) => {
    const tyre = document.querySelector(`.tyre[data-index="${index}"]`);
    tyre.style.backgroundColor = wear < 1 ? "rgba(0, 0, 0, 0.6)" : getColor(wear);
});

alt.on("tyres:numberOfWheels", (count) => {
    document.querySelectorAll(".tyre[selected]").forEach((tyre) => {
        tyre.toggleAttribute("selected", false);
    });
    for (let i = 0; i < count; i++) {
        const tyre = document.querySelector(`.tyre[data-index="${i}"]`);
        tyre.toggleAttribute("selected", true);
    }
});
