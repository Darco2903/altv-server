import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let webview = new alt.WebView("http://resource/client/webview/apps/spawner/index.html", false);
webview.isVisible = false;

webview.on("spawnVehicle", (hash) => {
    if (!player.vehicle) alt.emitServer("vehicle:create", hash);
    else alt.emitServer("vehicle:replace", hash);
    close();
});

alt.on("carManager:spawner", open);
alt.on("menuOpen", close);

function keyHandler(key) {
    if (key == 27) close();
}

function open() {
    if (webview.isVisible) return;
    alt.on("keyup", keyHandler);
    webview.toogle(true);
    toogleControls(false);
}

function close() {
    if (!webview.isVisible) return;
    alt.off("keyup", keyHandler);
    webview.toogle(false);
    toogleControls(true);
}

async function toogleControls(state) {
    if (!player.vehicle) alt.toggleGameControls(state);
    else {
        webview.toogleChat(state);
        webview.toogleOnlyVehMove(state);
    }
}
