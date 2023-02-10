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
    // close();
});

alt.on("playerManager:model", open);
alt.on("menuOpen", close);

function keyHandler(key) {
    if (key == 27) close();
}

function open() {
    if (webview.isVisible) return;
    alt.on("keyup", keyHandler);
    webview.toogle(true);
    toogleControls(false);
    setCam();
}

function close() {
    if (!webview.isVisible) return;
    alt.off("keyup", keyHandler);
    webview.toogle(false);
    toogleControls(true);
    alt.emitServer("player:SaveModel")
}

async function toogleControls(state) {
    if (!player.vehicle) alt.toggleGameControls(state);
    else {
        webview.toogleChat(state);
        webview.toogleOnlyVehMove(state);
    }
}

function setCam() {
    native.setGameplayCamRelativeHeading(180);
    native.setGameplayCamRelativePitch(0, 1);
}
