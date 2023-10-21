import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

const defaultKeys = {
    left: 37, // left arrow
    right: 39, // right arrow
    hazard: 38, // up arrow
};
const inputKeys = Object.assign({}, defaultKeys);
const APP_NAME = "vehicleSignals";

function resetSignals(vehicle) {
    native.setVehicleIndicatorLights(vehicle, 0, false);
    native.setVehicleIndicatorLights(vehicle, 1, false);
}

alt.on("keydown", (key) => {
    if (!player.vehicle || player.seat !== 1) return;
    let side;
    switch (key) {
        case inputKeys.left:
            side = "left";
            break;
        case inputKeys.right:
            side = "right";
            break;
        case inputKeys.hazard:
            side = "hazard";
            break;
        default:
            return;
    }
    if (side === player.vehicle.getStreamSyncedMeta("signals")) alt.emitServer("vehicle:signals:reset", player.vehicle);
    else alt.emitServer("vehicle:signals", player.vehicle, side);
});

alt.on("streamSyncedMetaChange", (vehicle, key, side) => {
    if (key !== "signals" || !(vehicle instanceof alt.Vehicle)) return;
    resetSignals(vehicle);
    switch (side) {
        case "right":
            native.setVehicleIndicatorLights(vehicle, 0, true);
            break;
        case "left":
            native.setVehicleIndicatorLights(vehicle, 1, true);
            break;
        case "hazard":
            native.setVehicleIndicatorLights(vehicle, 0, true);
            native.setVehicleIndicatorLights(vehicle, 1, true);
            break;
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
