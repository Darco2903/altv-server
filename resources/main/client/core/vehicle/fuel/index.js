import * as alt from "alt-client";
import * as native from "natives";

import "./prototypes.js";

const IDLE_FUEL_CONSUMPTION = 0.0001;
let tick;

/**
 * @param {alt.Vehicle} vehicle
 */
function startFuelConsumption(vehicle) {
    if (tick) return;
    // console.log("START FUEL CONSUMPTION");
    let syncCount = 0;
    tick = alt.setInterval(() => {
        if (!vehicle || !vehicle.valid) return;
        if (!vehicle.engineOn) return;
        const throttle = native.getControlNormal(0, 71); // INPUT_VEH_ACCELERATE
        const handbrake = native.isControlPressed(0, 76); // INPUT_VEH_HANDBRAKE
        // const speed = native.getEntitySpeed(vehicle);
        // const consumption = vehicle.fuelConsumption * (throttle / 100) * speed;
        let ratio = throttle * vehicle.rpm;
        if (handbrake) ratio *= 0.1;
        const consumption = vehicle.fuelConsumption * ratio + IDLE_FUEL_CONSUMPTION;
        if (vehicle.fuel - consumption <= 0) {
            vehicle.fuel = 0;
            native.setVehicleEngineOn(vehicle, false, false, true);
        } else {
            vehicle.fuel -= consumption;
        }
        // console.log("consumption", consumption, vehicle.fuel.toFixed(2));
        // console.log(throttle.toFixed(2), vehicle.rpm.toFixed(2), consumption, vehicle.fuel.toFixed(2));
        if (syncCount++ > 10) {
            vehicle.syncFuel();
            syncCount = 0;
        }
    }, 1000);
}

function stopFuelConsumption(vehicle) {
    if (!tick) return;
    // console.log("STOP FUEL CONSUMPTION");
    alt.clearInterval(tick);
    tick = null;
    vehicle.syncFuel();
}

alt.onServer(
    "vehicle:fuel:initialize",
    /** @param {alt.Vehicle} vehicle */
    async (vehicle) => {
        await alt.Utils.waitFor(() => vehicle.isSpawned, 4000);
        // console.log("server asked for fuel initialize", vehicle, vehicle.fuelLevel);
        const consumption = 0.1; // L/km
        alt.emitServer("vehicle:fuel:initialize", vehicle, vehicle.fuelLevel, consumption);
    }
);

// alt.on("enteredVehicle", (vehicle, seat) => {
//     if (seat !== -1) return;
//     startFuelConsumption(vehicle);
// });

// alt.on("changedVehicleSeat", (vehicle, oldSeat, seat) => {
//     if (seat === -1) startFuelConsumption(vehicle);
//     else if (oldSeat === -1) stopFuelConsumption();
// });

// alt.on("leftVehicle", (vehicle, seat) => {
//     if (seat !== -1) return;
//     stopFuelConsumption();
// });

alt.on("drivingCar", (state, vehicle) => {
    if (state) startFuelConsumption(vehicle);
    else stopFuelConsumption(vehicle);
});
