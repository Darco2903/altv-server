import * as alt from "alt-server";

/**
 * @param {alt.Vehicle} vehicle
 * @param {number} index
 */
export async function detachVehicleWheel(vehicle, index) {
    const pos = vehicle.pos;
    vehicle.pos = pos.sub(0, 0, 20);
    vehicle.frozen = true;
    vehicle.setWheelDetached(index, true);
    await alt.Utils.wait(100);
    vehicle.pos = pos;
    vehicle.frozen = false;
}

/**
 * @param {alt.Vehicle} vehicle
 * @returns {Promise<alt.Vector3[]>}
 */
export async function getWheelsPos(vehicle) {
    return new Promise((resolve) => {
        if (vehicle.netOwner) {
            alt.emitClient(vehicle.netOwner, "vehicle:getWheelsPos", vehicle);
            const onWheelsPos = (player, vehicle, wheelPos) => {
                if (player !== vehicle.netOwner) return;
                resolve(wheelPos);
                alt.offClient("vehicle:wheelsPos", onWheelsPos);
            };
            alt.onClient("vehicle:wheelsPos", onWheelsPos);
        } else resolve([]);
    });
}
