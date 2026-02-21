import * as alt from "alt-client";
import * as native from "natives";

import Battery from "./Battery.js";

Object.setPrototypeOf(alt.Vehicle.prototype, Battery.prototype);

let chargeInterval = null;

/**
 * Start charging the vehicle battery.
 * @param {alt.Vehicle} vehicle
 * @param {number} rate
 */
function startDriveCharge(vehicle, rate = 0.05) {
    // console.log("START CHARGE");
    let syncCount = 0;
    chargeInterval = alt.setInterval(() => {
        if (vehicle.engineOn && vehicle.hasBattery && !vehicle.isBatteryFull) {
            const batteryGain = vehicle.rpm / 20 + rate;
            vehicle.batteryCharge += batteryGain;
            // console.log("charging:", vehicle.batteryCharge, "gain:", batteryGain);
            if (vehicle.batteryCharge > vehicle.batteryCapacity) {
                vehicle.setBatteryFull();
            } else if (syncCount++ >= 10) {
                vehicle.syncBatteryCharge();
                syncCount = 0;
            }
        }
    }, 1000);
}

/**
 * Stop charging the vehicle battery.
 * @param {alt.Vehicle} vehicle
 */
function stopCharge(vehicle) {
    // console.log("STOP CHARGE");
    if (chargeInterval) {
        alt.clearInterval(chargeInterval);
        chargeInterval = null;
        vehicle.syncBatteryCharge();
    }
}

alt.on("drivingCar", (state, vehicle) => {
    if (!vehicle) return;
    if (state) startDriveCharge(vehicle);
    else stopCharge(vehicle);
});

alt.on("streamSyncedMetaChange", (entity, key, value) => {
    if (key !== "battery:charge") return;
    entity.batteryCharge = value;
});
