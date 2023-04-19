import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

alt.Player.prototype.tp = async function (pos) {
    console.log(pos);
    if (!(pos instanceof alt.Vector3)) {
        console.log("Teleportation aborted, not a valid position");
        return;
    }
    // native.setPedCoordsKeepVehicle(this, ...pos.toArray());
    native.startPlayerTeleport(this, ...pos.toArray(), 0, false, true, false);
    await alt.Utils.wait(500);
    // native.setPedCoordsKeepVehicle(this, ...pos.toArray());
    native.startPlayerTeleport(this, ...pos.toArray(), 0, false, true, false);
};

function getWaypointPos() {
    const waypoint = native.getFirstBlipInfoId(8);
    if (!native.doesBlipExist(waypoint)) {
        alt.emit("notificationRaw", "CHAR_BLOCKED", "Commande", "tpm", "Un repère GPS est requis pour cette commande");
        return;
    }
    let pos = native.getBlipInfoIdCoord(waypoint); //.add(0, 0, 100);
    // let [floor, z] = native.getGroundZFor3dCoord(...pos.toArray(), 0, 0);
    return pos;
}

alt.on("player:tp", (pos) => {
    player.tp(pos);
});

alt.onServer("tpm", () => {
    player.tp(getWaypointPos());
});
