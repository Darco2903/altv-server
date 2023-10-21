import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
const APP_NAME = "vehicleStarter";
const defaultKeys = {
    push: 49, // &
};
const inputKeys = Object.assign({}, defaultKeys);

alt.on("connectionComplete", init);
alt.on("resourceStart", init);

async function init() {
    await alt.Utils.waitFor(() => player.isSpawned, 15000);
    native.setPedConfigFlag(player, 241, true); // CPED_CONFIG_FLAG_LeaveEngineOnWhenExitingVehicles
    native.setPedConfigFlag(player, 429, true); // CPED_CONFIG_FLAG_DisableStartEngine
}

alt.on("keydown", async (key) => {
    // alt.KeyCode.Key1
    if (key === inputKeys.push && player.vehicle) {
        if (!native.getIsVehicleEngineRunning(player.vehicle)) {
            const animDictionary = "anim@veh@std@issi3@ds@base";
            let ignition = false;
            const ignitionTime = getIgnitionTime(player.vehicle);
            alt.emit("vehicle:ignition:start");
            let timeout = alt.setTimeout(() => {
                timeout = null;
                ignition = true;
            }, ignitionTime);
            while (true) {
                if (!alt.isKeyDown(inputKeys.push) && timeout) {
                    alt.clearTimeout(timeout);
                    alt.emit("vehicle:ignition:cancel");
                    break;
                } else if (ignition) {
                    native.setVehicleEngineOn(player.vehicle, true, false, true);
                    alt.emit("vehicle:ignition:success");
                    break;
                }

                native.taskPlayAnim(player, animDictionary, "start_engine", 3.0, 2.0, -1, 0, 0, false, false, false);
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

    let ignitionTime = Math.floor(Math.random() * 300) + 200;

    // less the engine is hot, more the ignition time is long
    let tempTime = 0;
    if (temp < 40) {
        tempTime = 300;
    } else if (temp < 60) {
        tempTime = 100;
    }

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
    return ignitionTime + tempTime + healthTime + classTime;
}

alt.on("resourceStart", () => {
    Object.keys(defaultKeys).forEach((name) => {
        inputKeys[name] = alt.LocalStorage.get(`${APP_NAME}:key:${name}`) ?? defaultKeys[name];
        alt.emit("input-manager:keyInit", APP_NAME, name, inputKeys[name]);
    });
});

alt.on("input-manager:keyUpdate", (app, name, key) => {
    if (app !== APP_NAME) return;
    inputKeys[name] = key;
    alt.LocalStorage.set(`${APP_NAME}:key:${name}`, key);
    alt.LocalStorage.save();
});

alt.on("input-manager:keyReset", (app, name) => {
    if (app !== APP_NAME) return;
    inputKeys[name] = defaultKeys[name];
    alt.emit("input-manager:keyInit", APP_NAME, name, inputKeys[name]);
    alt.LocalStorage.delete(`${APP_NAME}:key:${name}`);
    alt.LocalStorage.save();
});
