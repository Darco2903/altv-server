import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

alt.Player.prototype.tp = function (pos) {
    if (!(pos instanceof alt.Vector3)) {
        console.log("Teleportation aborted, not a valid position");
        return;
    }
    if (player.vehicle) native.setPedCoordsKeepVehicle(this, ...pos);
    else native.startPlayerTeleport(this, ...pos, 0, false, true, null);
};

function getWaypointPos() {
    const waypoint = native.getFirstBlipInfoId(8);
    if (!native.doesBlipExist(waypoint)) {
        alt.emit("notificationRaw", "CHAR_BLOCKED", "Commande", "tpm", "Un repère GPS est requis pour cette commande");
        return;
    }
    // var res = native.getGroundZFor3dCoord(coords.x, coords.y, coords.z + 100, undefined, undefined);
    return native.getBlipInfoIdCoord(waypoint);
}

alt.on("player:tp", (pos) => {
    player.tp(pos);
});

alt.onServer("tpm", () => {
    player.tp(getWaypointPos());
});
