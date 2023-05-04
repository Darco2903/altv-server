import * as alt from "alt-client";
import * as native from "natives";
import toggleNoclip from "../noclip.js";

const player = alt.Player.local;

/**
 * @param {alt.Utils.notificationOptions} notificationOptions
 */
alt.LocalPlayer.prototype.notify = function (notificationOptions) {
    alt.Utils.drawNotification(notificationOptions);
};

/**
 * @param {alt.Vector3} pos
 * @param {number} heading
 */
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

/**
 * @param {number} level
 * @returns {boolean}
 */
alt.LocalPlayer.prototype.authorized = function (level) {
    return this.getSyncedMeta("op") >= level;
};

/**
 * @param {boolean} state
 */
alt.LocalPlayer.prototype.toggleNoclip = toggleNoclip;
