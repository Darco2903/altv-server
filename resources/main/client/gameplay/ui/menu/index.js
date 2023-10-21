import * as alt from "alt-client";

const keys = {
    toggle: 112, // F1
};

const player = alt.Player.local;
const view = new alt.WebView("http://resource/client/gameplay/ui/menu/browser/index.html");
view.isVisible = false;

view.on("menu:option:click", (option) => {
    option = option.replace("menu-button-", "");
    console.log(`Clicked: ${option}`);
    toggleMenu(false);
    alt.emit("menu:option:open", option);
});

function toggleMenu(state) {
    if (state) {
        if (!alt.isCursorVisible()) view.centerPointer();
        view.focus();
        alt.emit("ui:close:all");
    } else {
        view.unfocus();
    }
    view.isVisible = state;
    if (alt.isCursorVisible() !== state) alt.showCursor(state);
    player.lockCamera(state);
    alt.emit("chat:enabled", !state);
}

alt.on("keyup", (key) => {
    if (key === keys.toggle) {
        toggleMenu(!view.isVisible);
    } else if (key === 27 && view.isVisible) {
        // Escape
        toggleMenu(false);
    }
});
