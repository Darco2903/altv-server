import * as alt from "alt-client";
// import * as native from "natives";

const player = alt.Player.local;
const view = new alt.WebView("http://resource/client/core/input-manager/browser/index.html");
view.isVisible = false;
let preventClose = false;

function toggle(state) {
    view.isVisible = state;
    if (alt.isCursorVisible() !== state) alt.showCursor(state);
    player.lockCamera(state);
    alt.emit("chat:enabled", !state);
    if (state) view.focus();
    else view.unfocus();
}

function getAppName(name) {
    return name.split("-");
}

view.on("input:change", (appName, key) => {
    let [app, name] = getAppName(appName);
    alt.setTimeout(() => {
        alt.emit("input-manager:keyUpdate", app, name, key);
    }, 500);
});

view.on("input:reset", (appName) => {
    let [app, name] = getAppName(appName);
    alt.emit("input-manager:keyReset", app, name);
});

view.on("input:wait", () => {
    alt.toggleGameControls(false);
    alt.once("keydown", (key) => {
        view.emit("input:get", key);
        setTimeout(() => {
            alt.toggleGameControls(true);
        }, 200);
    });
});

alt.on("ui:close:all", () => {
    toggle(false);
});

alt.on("keydown", (key) => {
    if (key === 27) {
        preventClose = !alt.gameControlsEnabled();
    }
});

alt.on("keyup", (key) => {
    if (key === 27 && view.isVisible && alt.gameControlsEnabled() && !preventClose) {
        // Escape
        toggle(false);
    }
});

alt.on("input-manager:keyInit", (app, name, key) => {
    view.emit("keyInit", `${app}-${name}`, key);
});

alt.on("menu:option:open", (id) => {
    if (id === "input-manager") toggle(true);
});
