import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

native.setPedConfigFlag(player, 241, true); // CPED_CONFIG_FLAG_LeaveEngineOnWhenExitingVehicles
native.setPedConfigFlag(player, 429, true); // CPED_CONFIG_FLAG_DisableStartEngine

alt.on("keydown", async (key) => {
    // alt.KeyCode.Key1
    if (key === 49 && player.vehicle) {
        if (!native.getIsVehicleEngineRunning(player.vehicle)) {
            let ignition = false;
            const ignitionTime = getIgnitionTime(player.vehicle);
            alt.emit("vehicle:ignition:start");
            let timeout = alt.setTimeout(() => {
                timeout = null;
                ignition = true;
            }, ignitionTime);
            while (true) {
                if (!alt.isKeyDown(49) && timeout) {
                    alt.clearTimeout(timeout);
                    alt.emit("vehicle:ignition:cancel");
                    break;
                } else if (ignition) {
                    native.setVehicleEngineOn(player.vehicle, true, false, true);
                    alt.emit("vehicle:ignition:success");
                    break;
                }

                native.setVehicleEngineOn(player.vehicle, true, false, true);
                await new Promise((resolve) => alt.nextTick(resolve));
                native.setVehicleEngineOn(player.vehicle, false, false, true);
            }
        } else {
            native.setVehicleEngineOn(player.vehicle, false, false, true);
        }
    }
});

/**
 * @param {alt.Vehicle} vehicle
 */
function getIgnitionTime(vehicle) {
    const temp = vehicle.engineTemperature;
    const fuelLevel = vehicle.fuelLevel;
    const engineHealth = native.getVehicleEngineHealth(vehicle);
    const vehicleClass = native.getVehicleClass(vehicle);

    console.log("temp:", temp);
    console.log("fuelLevel:", fuelLevel);
    console.log("engineHealth:", engineHealth);
    console.log("vehicleClass:", vehicleClass);

    let ignitionTime = Math.floor(Math.random() * 300) + 200;
    console.log("random:", ignitionTime);

    // less the engine is hot, more the ignition time is long
    let tempTime = 0;
    if (temp < 40) {
        tempTime = 300;
    } else if (temp < 60) {
        tempTime = 100;
    }
    console.log("tempTime:", tempTime);

    // more the engine is damaged, more the ignition time is long
    let healthTime = 0;
    if (engineHealth < 100) {
        healthTime = 1000;
    } else if (engineHealth < 300) {
        healthTime = 500;
    } else if (engineHealth < 500) {
        healthTime = 300;
    } else if (engineHealth < 800) {
        healthTime = 150;
    }
    console.log("healthTime:", healthTime);

    // more the vehicle is heavy, more the ignition time is long
    let classTime = 0;
    if (vehicleClass === 7) {
        classTime = 0;
    } else if (vehicleClass === 8) {
        classTime = -100;
    }
    if (vehicleClass === 16) {
        classTime = 1500;
    } else if (vehicleClass === 20) {
        classTime = 700;
    }
    console.log("classTime:", classTime);

    console.log("ignitionTime:", ignitionTime + tempTime + healthTime + classTime);
    return ignitionTime + tempTime + healthTime + classTime;
}
