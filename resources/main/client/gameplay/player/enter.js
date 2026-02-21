import * as alt from "alt-client";
import * as native from "natives";

const DRIVER_SEAT = -1;

const player = alt.Player.local;

alt.onServer(
    "vehicle:enter",
    /** @param {alt.Vehicle} vehicle */
    (vehicle) => {
        for (let i = DRIVER_SEAT; i < vehicle.seatCount + DRIVER_SEAT; i++) {
            // alt.log("isFree", i, native.isVehicleSeatFree(vehicle, i, true));
            if (native.isVehicleSeatFree(vehicle, i, true)) {
                native.setPedIntoVehicle(player, vehicle, i);
                return;
            }
        }
    }
);
