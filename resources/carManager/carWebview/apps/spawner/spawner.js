import * as alt from "alt-client";

const player = alt.Player.local;

let webview = new alt.WebView("http://resource/apps/spawner/index.html", false);
webview.isVisible = false;

webview.on("spawnVehicle", (model) => {
    const hash = alt.hash(model);
    if (!player.vehicle) alt.emitServer("vehicle:create", hash);
    else if (!notSameVeh(hash, null)) return;
    else alt.emitServer("vehicle:replace", hash);
    close();
});

webview.on("spawnGarageVehicle", (id) => {
    if (!player.vehicle) alt.emitServer("vehicle:import", id);
    else if (!notSameVeh(null, id)) return;
    else alt.emitServer("vehicle:importReplace", id);
    close();
});

alt.on("carManager:spawner", open);

function keyHandler(key) {
    if (key == 27) close(); // ESC
}

function open() {
    if (webview.isVisible) return;
    alt.on("keyup", keyHandler);
    webview.toogle(true);
    toogleControls(false);
    alt.emitServer("getPlayerVehicles");
}

function close() {
    if (!webview.isVisible) return;
    alt.off("keyup", keyHandler);
    webview.toogle(false);
    toogleControls(true);
}

async function toogleControls(state) {
    alt.setMeta("controlsEnabled", state);
    if (!player.vehicle) alt.toggleGameControls(state);
    else webview.toogleOnlyVehMove(state);
}

alt.onServer("playerGarage", (res) => {
    webview.emit("garageList", res);
});

function notSameVeh(model, id) {
    return (!player.vehicle.hasSyncedMeta("id") && player.vehicle.model != model) || (player.vehicle.hasSyncedMeta("id") && player.vehicle.getSyncedMeta("id") != id);
}
