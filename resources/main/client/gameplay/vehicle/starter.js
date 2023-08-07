import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

alt.on("resourceStart", async () => {
    await alt.Utils.waitFor(() => player.isSpawned, 15000);
    native.setPedConfigFlag(player, 241, true); // CPED_CONFIG_FLAG_LeaveEngineOnWhenExitingVehicles
    native.setPedConfigFlag(player, 429, true); // CPED_CONFIG_FLAG_DisableStartEngine
    native.setPedConfigFlag(player, 141, true); // CPED_CONFIG_FLAG_WillJackAnyPlayer
});

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
    let classTime;
    switch (vehicleClass) {
        case 8: // Motorcycles
            classTime = -100;
            break;

        case 0: // Compacts
        case 1: // Sedans
        case 2: // SUVs
        case 3: // Coupes
        case 6: // Sports
        case 7: // Super
            classTime = 0;
            break;

        case 4: // Muscle
        case 5: // Sports Classics
        case 9: // Off-Road
            classTime = 100;
            break;

        case 10: // Industrial
        case 11: // Utility
        case 12: // Vans
        case 17: // Service
        case 18: // Emergency
        case 20: // Commercial
            classTime = 700;
            break;

        case 14: // Boats
        case 15: // Helicopters
        case 16: // Planes
        case 19: // Military
            classTime = 1000;
            break;

        default:
            classTime = 0;
            break;
    }
    console.log("classTime:", classTime);

    console.log("ignitionTime:", ignitionTime + tempTime + healthTime + classTime);
    return ignitionTime + tempTime + healthTime + classTime;
}
