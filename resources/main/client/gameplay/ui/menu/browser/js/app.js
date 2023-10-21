if (window.alt === undefined) {
    window.alt = {
        emit: () => {},
        on: () => {},
    };
}

const menuOptionButtons = document.querySelectorAll("button.menu-option");

menuOptionButtons.forEach((button) => {
    button.addEventListener("click", () => {
        button.blur();
        alt.emit("menu:option:click", button.id);
    });
});
