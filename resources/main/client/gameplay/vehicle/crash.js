import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

alt.on("enteredVehicle", (vehicle, seat) => {
    if (vehicle.model === 3096296255) {
        native.setPedConfigFlag(player, 32, false);
        native.setEntityInvincible(player, true);
        native.setEntityInvincible(vehicle, true);
        native.setEntityProofs(vehicle, true, true, true, true, true, true, true, true);
    }
});

alt.on("leftVehicle", (vehicle, seat) => {
    if (vehicle.model === 3096296255) {
        native.setPedConfigFlag(player, 32, true);
        native.setEntityInvincible(player, false);
        native.setEntityInvincible(vehicle, false);
        native.setEntityProofs(vehicle, false, false, false, false, false, false, false, false);
    }
});
