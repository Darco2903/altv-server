import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let webview = new alt.WebView("http://resource/apps/armory/index.html", false);
webview.isVisible = false;

webview.on("giveAll", () => alt.emitServer("player:giveAllWeapons"));
webview.on("removeAll", () => alt.emitServer("player:removeWeapons"));
webview.on("giveWeapon", (hash, amount, equipNow) => {
    alt.emitServer("player:giveWeapon", hash, amount, equipNow);
});

alt.on("playerManager:armory", open);

function keyHandler(key) {
    if (key == 27) close(); // ESC
}

function open() {
    if (webview.isVisible) return;
    alt.on("keyup", keyHandler);
    webview.toggle(true);
    toogleControls(false);
}

function close() {
    if (!webview.isVisible) return;
    alt.off("keyup", keyHandler);
    webview.toggle(false);
    toogleControls(true);
}

async function toogleControls(state) {
    alt.setMeta("controlsEnabled", state);
    if (!player.vehicle) alt.toggleGameControls(state);
    else webview.toggleOnlyVehMove(state);
}
