import * as alt from "alt-client";
import * as native from "natives";

alt.onServer(
    "repair:body",
    /** @param {alt.Vehicle} vehicle */
    (vehicle) => {
        const wear = vehicle.getTyresWear();
        const engineHealth = native.getVehicleEngineHealth(vehicle);
        native.setVehicleFixed(vehicle);
        native.setVehicleEngineHealth(vehicle, engineHealth);
        vehicle.setTyresWear(wear);
    }
);

alt.onServer(
    "repair:engine",
    /** @param {alt.Vehicle} vehicle */
    (vehicle) => {
        native.setVehicleEngineHealth(vehicle, 1000);
    }
);
alt.onServer(
    "repair:tyres",
    /** @param {alt.Vehicle} vehicle */
    (vehicle) => {
        for (let i = 0; i < 6; i++) {
            native.setVehicleTyreFixed(vehicle, i);
        }
    }
);
