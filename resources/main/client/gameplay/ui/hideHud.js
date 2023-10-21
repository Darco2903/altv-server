import * as alt from "alt-client";
import * as native from "natives";

const defaultKeys = {
    toggle: 114, // F3
};
const inputKeys = Object.assign({}, defaultKeys);
const APP_NAME = "hideHud";
let isHidden = false;
let hiddenViews = [];

function toggle(state) {
    if (state === isHidden) return;
    isHidden = state;
    native.displayHud(!state);
    native.displayRadar(!state);
    alt.emit("hideHud:toggle", state);
    if (state) {
        hiddenViews = alt.WebView.all.filter((view) => view.isOverlay && view.isVisible);
    }
    hiddenViews.forEach((view) => {
        view.isVisible = !state;
    });
}

alt.on("keyup", (key) => {
    if (key === inputKeys.toggle) {
        toggle(!isHidden);
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
