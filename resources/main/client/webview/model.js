import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let view = new alt.WebView("http://resource/client/webview/model/index.html", false);
view.isVisible = false;

view.on("setPlayerModel", async (hash) => {
    hash = parseInt(hash);
    if (player.model === hash) return;
    const veh = player.vehicle;
    const seat = player.seat;
    alt.emitServer("player:setModel", hash);
    try {
        await alt.Utils.waitFor(() => player.model === hash, 2000);
        setCam();
        if (veh) {
            native.setPedIntoVehicle(player, veh, -seat);
        }
    } catch (error) {}
});

function setCam() {
    native.setGameplayCamRelativeHeading(180);
    native.setGameplayCamRelativePitch(0, 1);
}

view.toggle = function (state) {
    if (state && !view.isVisible) {
        view.centerPointer();
        alt.Utils.toggleOnlyMove(true);
        view.open();
        setCam();
    } else if (!state && view.isVisible) {
        view.close();
        alt.Utils.toggleOnlyMove(false);
        alt.emitServer("player:saveModel");
    }
};

export default view;
