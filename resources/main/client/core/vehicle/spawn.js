import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

alt.Vehicle.prototype.replace =
    /**
     * @param {alt.Vehicle} vehicle
     */
    async function (vehicle) {
        native.networkFadeOutEntity(this, false, true);
        await alt.Utils.waitFor(() => vehicle.isSpawned && player.vehicle === vehicle, 2000);
        native.setEntityCollision(this, false, false);
        native.setEntityVisible(this, false, 0);
        native.setEntityVisible(vehicle, false, 0);
        native.networkFadeInEntity(vehicle, false, 0);
        if (player.vehicle === vehicle && player.seat === 1) {
            const velocity = native.getEntityVelocity(this);
            native.setEntityVelocity(vehicle, velocity.x, velocity.y, velocity.z);
        }
    };

alt.onServer("vehicle:replace", (oldModel, newModel) => oldModel.replace(newModel));
