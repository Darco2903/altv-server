import * as alt from "alt-client";

const player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/webview/spawner/index.html", false);
webview.isVisible = false;

webview.on("spawnVehicle", (model) => {
    const hash = alt.hash(model);
    if (!player.vehicle) alt.emitServer("vehicle:create", hash);
    else if (!notSameVeh(hash, null)) return;
    else alt.emitServer("vehicle:replace", hash);
    close();
});

webview.on("spawnSavedVehicle", (id) => {
    if (!player.vehicle) {
        alt.emitServer("vehicle:import", id);
    } else if (notSameVeh(null, id)) {
        alt.emitServer("vehicle:importReplace", id);
    }
    close();
});

/**
 * @param {boolean} state
 */
export function toggle(state) {
    if (state && !webview.isVisible) {
        webview.toggle(true);
        toogleControls(false);
        alt.emitServer("getPlayerVehicles");
    } else if (!state && webview.isVisible) {
        webview.toggle(false);
        toogleControls(true);
    }
}

// async function toogleControls(state) {
//     if (!player.vehicle) {
//         alt.toggleGameControls(state);
//     } else {
//         alt.Utils.toggleOnlyVehMove(state);
//     }
// }

function notSameVeh(model, id) {
    return (
        (!player.vehicle.hasSyncedMeta("id") && player.vehicle.model != model) ||
        (player.vehicle.hasSyncedMeta("id") && player.vehicle.getSyncedMeta("id") != id)
    );
}

alt.onServer("playerGarage", (res) => {
    webview.emit("garageList", res);
});
