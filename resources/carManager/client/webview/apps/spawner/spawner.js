import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/webview/apps/spawner/index.html", false);
webview.isVisible = false;
webview.on("spawnVehicle", (hash) => {
    if (!player.vehicle) alt.emitServer("vehicle:create", hash);
    else alt.emitServer("vehicle:replace", hash, player.vehicle.speed);
    close();
});

alt.on("carManager:spawner", open);
alt.on("menuOpen", close);

function keyHandler(key) {
    if (key == 27) close();
}

function open() {
    if (webview.isVisible) return;
    webview.toogle(true);
    toogleControls(false);
    alt.on("keydown", keyHandler);
}

function close() {
    if (!webview.isVisible) return;
    webview.toogle(false);
    toogleControls(true);
    alt.off("keydown", keyHandler);
}

function toogleControls(state) {
    if (!player.vehicle) setTimeout(() => alt.toggleGameControls(state), 100);
    else {
        webview.toogleChat(state);
        webview.toogleCamControl(state);
        webview.toogleVehicleExitControl(state);
        webview.toogleFrontEndControl(state);
    }
}
