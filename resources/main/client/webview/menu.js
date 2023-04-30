import * as alt from "alt-client";
//import * as native from "natives";
import * as chat from "./chat.js";
import * as nametag from "../nametag.js";
import * as spawner from "./spawner.js";
import * as tuner from "./tuner.js";

let player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/webview/menu/index.html");
webview.isVisible = false;

webview.on("event", (id, state) => {
    switch (id) {
        case "spawner":
            toggle(false);
            spawner.toggle(true);
            break;

        case "tuner":
            toggle(false);
            tuner.toggle(true);
            break;

        case "repair":
        case "despawn":
        case "register":
        case "delete":
            alt.emitServer(`vehicle:${id}`, player.vehicle);
            toggle(false);
            break;

        case "model":
            // toggle
            toggle(false);
            break;

        case "armory":
            // toggle
            toggle(false);
            break;

        case "nametag":
            nametag.toggle(state);
            break;
    }
});

function updateWebview() {
    webview.emit("vehicle", !!player.vehicle);
    if (player.vehicle?.hasSyncedMeta("id")) {
        webview.emit("vehicleID", player.vehicle.getSyncedMeta("id"));
    }
    webview.emit("nametag", alt.getMeta("displayNametag"));
}

// alt.on("enteredVehicle", switchControls);
// alt.on("leftVehicle", switchControls);

/**
 * @param {boolean} state
 */
export function toggle(state) {
    if ((state && webview.isVisible) || (!state && !webview.isVisible)) {
        return;
    }
    updateWebview();
    webview.centerPointer();
    webview.toggle(state);
    alt.Utils.toggleOnlyMove(state);
}

export function isVisible() {
    return webview.isVisible;
}

alt.on("webview:closeAll", () => {
    toggle(false);
});
