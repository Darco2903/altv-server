import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

alt.onServer("command:tpm", () => {
    const waypoint = native.getFirstBlipInfoId(8);
    if (!waypoint) {
        player.sendNotification({
            imageName: "CHAR_BLOCKED",
            headerMsg: "/tpm",
            message: "Veuillez définir un point GPS",
        });
        return;
    }
    const pos = native.getBlipInfoIdCoord(waypoint);
    native.setPedCoordsKeepVehicle(player, pos.x, pos.y, pos.z);
});
