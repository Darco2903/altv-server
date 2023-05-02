import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

alt.LocalPlayer.prototype.notify = function (notificationOptions) {
    alt.Utils.drawNotification(notificationOptions);
};

alt.LocalPlayer.prototype.tp = function (pos, heading = 0) {
    if (pos instanceof alt.Vector3) {
        if (!player.vehicle) {
            native.startPlayerTeleport(player, ...pos.toArray(), heading, false, true, false);
        } else {
            native.setPedCoordsKeepVehicle(player, ...pos.toArray());
        }
    } else {
        throw new Error("pos must be a Vector3");
    }
};
