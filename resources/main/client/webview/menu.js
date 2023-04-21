import * as alt from "alt-client";
//import * as native from "natives";
import * as chat from "./chat.js";
import { toogleNametagDisplay } from "../nametag.js";
import { toggle } from "./spawner.js";
import { toggle } from "./tuner.js";

let player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/webview/menu/index.html");
webview.isVisible = false;

webview.on("event", (id, state) => {
    switch (id) {
        case "spawner":
            toggle(true);
            toggle(false);
            break;

        case "tuner":
            toggle(true);
            toggle(false);
            break;

        case "repair":
        case "despawn":
        case "register":
        case "delete":
            // toggle
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
            toogleNametagDisplay(state);
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

/**
 * @param {boolean} state
 */
function toggleControls(state) {
    chat.enable(state);
    if (!player.vehicle) {
        alt.toggleGameControls(state);
    } else {
        alt.Utils.toggleOnlyVehMove(state);
    }
}

function switchControls() {
    if (webview.isVisible) {
        alt.Utils.toggleOnlyVehMove(!!player.vehicle);
        alt.toggleGameControls(!player.vehicle);
    }
}

alt.on("enteredVehicle", switchControls);
alt.on("leftVehicle", switchControls);

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
    toggleControls(!state);
}

alt.on("webview:closeAll", () => {
    toggle(false);
});
