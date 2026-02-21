import * as alt from "alt-client";

/**
 * @param {alt.Vehicle} vehicle
 * @returns {Promise<void>}
 */
export async function waitForVehicleSpawn(vehicle) {
    await alt.Utils.waitFor(() => vehicle.isSpawned);
}

/**
 * @param {alt.Vehicle} vehicle
 * @returns {number[]}
 */
export function getWheelsIndexes(vehicle) {
    switch (vehicle.wheelsCount) {
        case 2:
            return [0, 4];
        case 3:
            return [0, 1, 4];
        case 4:
            return [0, 1, 4, 5];
        default:
            return [0, 1, 2, 3, 4, 5];
    }
}

export function convertIndex(vehicle, index) {
    const indexes = getWheelsIndexes(vehicle);
    return indexes[index];
}

/**
 * @param {number} wheelIndex
 * @returns {string}
 */
export function convertWheelIndexToBone(wheelIndex) {
    switch (wheelIndex) {
        case 0:
            return "wheel_lf";
        case 1:
            return "wheel_rf";
        case 2:
            return "wheel_lm1";
        case 3:
            return "wheel_rm1";
        case 4:
            return "wheel_lr";
        case 5:
            return "wheel_rr";
        case 6:
    }
}
