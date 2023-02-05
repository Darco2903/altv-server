import * as alt from "alt-client";
//import * as native from "natives";

import "./WebView";
import "./eventHandler";

let player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/app/menu.html");
webview.isVisible = false;
alt.setMeta("controlsEnabled", true);

webview.on("event", (event) => alt.emit("menu:eventHandler", event));

alt.on("menu:toogle", toogleMenu);
alt.on("keyup", (key) => {
    switch (key) {
        case 27: // ESC
            if (!webview.isVisible) return;
        //fall through
        case 75: // K
            if (!alt.getMeta("controlsEnabled") && !webview.isVisible) return;
            toogleMenu();
            break;

        default:
            break;
    }
});

function toogleMenu() {
    const state = !webview.isVisible;
    if (state) {
        update();
        const inVeh = !!player.vehicle;
        alt.Utils.waitFor(() => !!player.vehicle != inVeh, 3000)
            .then(() => {
                if (!webview.isVisible) return;
                if (!player.vehicle) {
                    webview.toogleChat(true);
                    webview.toogleOnlyVehMove(true);
                } else alt.toggleGameControls(true);
                toogleControls(false);
                update();
            })
            .catch(() => {});
    }
    webview.toogle(state);
    toogleControls(!state);
}

function update() {
    alt.emit("menuOpen");
    webview.centerPointer();
    webview.emit("resources", getResourceNames());
    webview.emit("vehicle", player.vehicle && player.vehicle.valid);
    webview.emit("nametag", alt.getMeta("displayNametag"));
}

function toogleControls(state) {
    if (!player.vehicle) alt.toggleGameControls(state);
    else {
        webview.toogleChat(state);
        webview.toogleOnlyVehMove(state);
    }
}

function getResourceNames() {
    return alt.Resource.all.map((res) => res.name);
}
