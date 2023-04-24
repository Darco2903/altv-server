import * as alt from "alt-client";

const player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/webview/spawner/index.html", false);
webview.isVisible = false;

webview.on("spawnVehicle", (model) => {
    const hash = alt.hash(model);
    if (!player.vehicle) {
        alt.emitServer("vehicle:createPlayersIn", hash, [player]);
    } else if (notSameVeh(hash, null)) {
        alt.emitServer("vehicle:replace", player.vehicle, hash);
    }
    toggle(false);
});

webview.on("spawnSavedVehicle", (id) => {
    if (!player.vehicle) {
        alt.emitServer("vehicle:importSaved", id, [player]);
    } else if (notSameVeh(null, id)) {
        alt.emitServer("vehicle:importSavedReplace", player.vehicle, id);
    }
    toggle(false);
});

/**
 * @param {boolean} state
 */
export function toggle(state) {
    if (state && !webview.isVisible) {
        webview.toggle(true);
        alt.Utils.toggleOnlyMove(true);
        alt.emitServer("getPlayerVehicles");
    } else if (!state && webview.isVisible) {
        webview.toggle(false);
        alt.Utils.toggleOnlyMove(false);
    }
}

function notSameVeh(model, id) {
    return (
        (!player.vehicle.hasSyncedMeta("id") && player.vehicle.model != model) ||
        (player.vehicle.hasSyncedMeta("id") && player.vehicle.getSyncedMeta("id") != id)
    );
}

alt.onServer("playerGarage", (res) => {
    webview.emit("garageList", res);
});

alt.on("webview:closeAll", () => {
    toggle(false);
});
