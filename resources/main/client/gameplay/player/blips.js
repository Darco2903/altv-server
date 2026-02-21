import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

/** @type {alt.PointBlip} */
let point;

function getPlayerBlip() {
    return alt.Blip.all.find((blip) => blip.name === player.name);
}

function fadePlayerBlip() {
    point.fade(0, 0);
}

alt.on("resourceStart", () => {
    alt.Utils.waitFor(() => (point = getPlayerBlip()), 5000).then(() => {
        // console.log("player blip found");
        alt.everyTick(fadePlayerBlip);
    });
});
