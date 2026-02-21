import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let updateInterval;
const UPDATE_INTERVAL = 200;
const HEAT_GENERATE_COEF = 0.00000002;

function getHeatGenerated(vehicle) {}

function toggle(state) {
    if (state && player.vehicle && !updateInterval) {
        const vehicle = player.vehicle;
        // let engineTemp = vehicle.getStreamSyncedMeta("engineTemp");
        let engineTemp = 90;
        const radiatorEfficiency = vehicle.getStreamSyncedMeta("radiatorEfficiency");
        const oilVolume = vehicle.oilLevel;

        const engineStockPower = vehicle.handling.initialDriveForce * vehicle.handling.driveMaxFlatVel * 30;

        updateInterval = alt.setInterval(() => {
            if (!vehicle) return;

            if (vehicle.engineOn) {
                const turboPower = native.isToggleModOn(vehicle, 18) ? 150 : 0;
                const engineStagePower = native.getVehicleModModifierValue(vehicle, 11, native.getVehicleMod(vehicle, 11));
                const enginePower = engineStockPower + engineStagePower + turboPower;
                const rpmHeat = vehicle.rpm;
                const throttle = native.getControlNormal(0, 71);
                console.log(rpmHeat, throttle);

                // const heatGenerated = enginePower * (5 / oilVolume) * HEAT_GENERATE_COEF * UPDATE_INTERVAL * Math.log(vehicle.rpm * 10);
                // console.log(heatGenerated);
                // engineTemp += heatGenerated;
            } else {
                engineTemp -= 0.01;
            }

            const speed = vehicle.getRealSpeed();
            const airFlow = speed > Math.exp(2) ? Math.log(speed) - 2 : 0;
            engineTemp -= airFlow * radiatorEfficiency * 0.01;

            const radiatorActive = engineTemp > 90;
            if (radiatorActive) {
                // engineTemp -= 0.05;
            }

            // console.log(engineTemp, radiatorActive);
        }, UPDATE_INTERVAL);
    } else if (!state && updateInterval) {
        alt.clearInterval(updateInterval);
        updateInterval = null;
    }
}

// alt.on("drivingCar", toggle);

// alt.on("vehicle:initDefaultValues", (vehicle) => {
// });
