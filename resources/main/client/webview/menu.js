import * as alt from "alt-client";
import * as chat from "./chat.js";
//import * as native from "natives";

let player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/webview/menu/index.html");
webview.isVisible = false;

webview.on("event", (id, checked) => {
    switch (id) {
        case "spawner":
        case "tuner":
            closeMenu();
            alt.emit(`carManager:${id}`);
            break;

        case "repair":
        case "despawn":
        case "register":
        case "delete":
            closeMenu();
            alt.emitServer(`vehicle:${id}`);
            break;

        case "model":
        case "armory":
            closeMenu();
            alt.emit(`playerManager:${id}`);
            break;

        case "nametag":
            alt.emit("nametag:toogle", checked);
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
        webview.toggleOnlyVehMove(state);
    }
}

function switchControls() {
    if (webview.isVisible) {
        webview.toggleOnlyVehMove(!!player.vehicle);
        alt.toggleGameControls(!player.vehicle);
    }
}

alt.on("enteredVehicle", switchControls);
alt.on("leftVehicle", switchControls);

/**
 * @param {boolean} state
 */
export async function toggleMenu(state) {
    if ((!state && webview.isVisible) || (state && !webview.isVisible)) {
        return;
    }
    updateWebview();
    webview.centerPointer();
    webview.toggle(state);
    toggleControls(!state);
}

alt.on("webview:close", () => {
    toggleMenu(false);
});
