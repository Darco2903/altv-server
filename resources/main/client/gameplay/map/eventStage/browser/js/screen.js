if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const screen = document.querySelector("#screen");
alt.on("screen:source", (url, startTime) => {
    screen.src = url;
    screen.play();
    screen.addEventListener(
        "canplay",
        () => {
            // const start = (alt.getNetTime() - startTime) / 1000;
            const start = (Date.now() - startTime) / 1000;
            screen.currentTime = start;
        },
        { once: true }
    );
});
