import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let webview = new alt.WebView("http://resource/apps/model/index.html", false);
webview.isVisible = false;

webview.on("setPlayerModel", async (hash) => {
    if (player.model == hash) return;
    const veh = player.vehicle;
    const seat = player.seat;
    alt.emitServer("player:setModel", hash);
    await alt.Utils.waitFor(() => player.model == hash, 2000);
    setCam();
    console.log("seat", seat);
    if (veh) native.setPedIntoVehicle(player, veh, seat - 2);
});

alt.on("playerManager:model", open);

function keyHandler(key) {
    if (key == 27) close(); // ESC
}

function open() {
    if (webview.isVisible) return;
    alt.on("keyup", keyHandler);
    webview.toggle(true);
    toogleControls(false);
    setCam();
}

function close() {
    if (!webview.isVisible) return;
    alt.off("keyup", keyHandler);
    webview.toggle(false);
    toogleControls(true);
    alt.emitServer("player:SaveModel");
}

async function toogleControls(state) {
    alt.setMeta("controlsEnabled", state);
    if (!player.vehicle) alt.toggleGameControls(state);
    else webview.toggleOnlyVehMove(state);
}

function setCam() {
    native.setGameplayCamRelativeHeading(180);
    native.setGameplayCamRelativePitch(0, 1);
}
