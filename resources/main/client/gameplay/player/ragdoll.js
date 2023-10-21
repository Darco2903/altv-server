import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let active = false;
let tick = false;
const defaultKeys = {
    toggle: 192, // ù alt.KeyCode["`"]
};
const inputKeys = Object.assign({}, defaultKeys);
const APP_NAME = "ragdoll";

function start() {
    active = true;
    tick = alt.everyTick(() => {
        native.setPedToRagdoll(player, 0, 0, 0, false, false, false);
    });
}

function stop() {
    active = false;
    alt.clearEveryTick(tick);
    tick = false;
}

alt.on("keydown", (key) => {
    if (key === inputKeys.toggle) {
        if (active) stop();
        else start();
    }
});

alt.on("resourceStop", () => {
    alt.setMeta("ragdoll:active", active);
});

alt.on("resourceStart", () => {
    if (alt.getMeta("ragdoll:active")) start();

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
