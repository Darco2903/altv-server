import * as alt from "alt-client";

const player = alt.Player.local;
const defaultKeys = {
    toggle: 115, // F4
};
const inputKeys = Object.assign({}, defaultKeys);
const APP_NAME = "menu";
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
    if (key === inputKeys.toggle) {
        toggleMenu(!view.isVisible);
    } else if (key === 27 && view.isVisible) {
        // Escape
        toggleMenu(false);
    }
});

alt.on("resourceStart", () => {
    Object.keys(defaultKeys).forEach((name) => {
        inputKeys[name] = alt.LocalStorage.get(`${APP_NAME}:key:${name}`) ?? defaultKeys[name];
        alt.emit("input-manager:keyInit", APP_NAME, name, inputKeys[name]);
    });
});

alt.on("input-manager:keyUpdate", (app, name, key) => {
    if (app !== APP_NAME) return;
    inputKeys[name] = key;
    alt.LocalStorage.set(`${APP_NAME}:key:${name}`, key);
    alt.LocalStorage.save();
});

alt.on("input-manager:keyReset", (app, name) => {
    if (app !== APP_NAME) return;
    inputKeys[name] = defaultKeys[name];
    alt.emit("input-manager:keyInit", APP_NAME, name, inputKeys[name]);
    alt.LocalStorage.delete(`${APP_NAME}:key:${name}`);
    alt.LocalStorage.save();
});
