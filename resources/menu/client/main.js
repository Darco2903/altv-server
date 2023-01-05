import * as alt from "alt-client";
import * as native from "natives";

import "./WebView";
import "./eventHandler";

let player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/app/menu.html");
webview.isVisible = false;
webview.on("event", (event) => alt.emit("menu:eventHandler", event));

alt.on("menu:toogle", toogleMenu);
alt.on("keyup", (key) => {
    switch (key) {
        case 27: // ESC
            if (!webview.isVisible) return;
        //fall through
        case 75: // K
            toogleMenu();
            break;

        default:
            break;
    }
});

function toogleMenu() {
    const state = !webview.isVisible;
    if (state) open();
    webview.toogle(state);
    toogleControls(!state);
}

function open() {
    alt.emit("menuOpen");
    webview.centerPointer();
    webview.emit("resources", getResourceNames());
    webview.emit("vehicle", !!player.vehicle);
    webview.emit("nametag", alt.getMeta("displayNametag"));
}

function toogleControls(state) {
    if (!player.vehicle) alt.toggleGameControls(state);
    else {
        webview.toogleChat(state);
        webview.toogleCamControl(state);
        webview.toogleVehicleExitControl(state);
        webview.toogleFrontEndControl(state);
    }
}

function getResourceNames() {
    return alt.Resource.all.map((res) => res.name);
}
