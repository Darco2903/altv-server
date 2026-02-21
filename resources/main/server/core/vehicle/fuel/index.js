import * as alt from "alt-server";

import "./prototypes.js";

const IDLE_FUEL_CONSUMPTION = 0.0001;
const IDLE_CONSUPTION_TIMEOUT_TIME = 1_000;

alt.on("vehicle:spawned", async (vehicle) => {
    const onOwner = (entity, owner, oldOwner) => {
        // console.log("netOwnerChange", entity, owner?.name, oldOwner?.name);
        if (entity !== vehicle) return;
        alt.emitClient(owner, "vehicle:fuel:initialize", vehicle);
        alt.off("netOwnerChange", onOwner);
    };
    alt.on("netOwnerChange", onOwner);
});
let i = 0;
alt.onClient(
    "vehicle:fuel:initialize",
    /**
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @param {number} fuelCapacity
     * @param {number} consumption
     */
    (player, vehicle, fuelCapacity, consumption) => {
        vehicle.fuelCapacity = fuelCapacity;
        vehicle.fuel = vehicle.fuelCapacity;
        vehicle.fuelConsumption = consumption;
        // console.log(++i, "fuel initialized", vehicle.fuel, vehicle.fuelCapacity, vehicle.fuelConsumption);
    }
);

alt.onClient(
    "vehicle:fuel:sync",
    /**
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @param {number} fuel
     */
    (player, vehicle, fuel) => {
        if (!vehicle?.valid) return;
        vehicle.fuel = fuel;
    }
);

alt.on("resourceStart", () => {
    alt.setInterval(() => {
        alt.Vehicle.all.forEach((veh) => {
            if (veh.engineOn && !veh.driver && veh.fuel > 0) {
                // console.log("idle fuel consumption", veh.fuel.toFixed(2));
                const consumption = (IDLE_FUEL_CONSUMPTION / 1000) * IDLE_CONSUPTION_TIMEOUT_TIME;

                if (veh.fuel - consumption < 0) {
                    veh.fuel = 0;
                    // console.log("vehicle out of fuel");
                    if (veh.netOwner) {
                        // console.log("has owner, turning off engine");
                        alt.emitClient(veh.netOwner, "vehicle:engine:toggle", veh, false, true);
                    } else {
                        const onOwner = (entity, owner, oldOwner) => {
                            if (entity === veh) {
                                // console.log("owner found, turning off engine");
                                alt.emitClient(owner, "vehicle:engine:toggle", veh, false, true);
                                alt.off("netOwnerChange", onOwner);
                            }
                        };
                        // console.log("no owner, waiting for owner");
                        alt.on("netOwnerChange", onOwner);
                    }
                    // veh.engineOn = false;
                    // alt.Utils.waitFor(() => veh.engineOn, 5000)
                    //     .then(() => {
                    //         console.log("engine failed to turn off, forcing it");
                    //         veh.engineOn = false;
                    //     })
                    //     .catch(() => {
                    //         console.log("engine successfully turned off");
                    //     });
                } else {
                    veh.fuel -= consumption;
                }
                // console.log("fuel", veh.fuel.toFixed(4));
            }
        });
    }, IDLE_CONSUPTION_TIMEOUT_TIME);
});

alt.Utils.Chat.registerCmd({
    name: "setFuel",
    args: [
        {
            name: "fuel",
            type: "number",
            required: true,
        },
    ],
    execute: (player, [fuel = 0]) => {
        const veh = player.vehicle;
        if (!veh) return;
        fuel = Math.min(veh.fuelCapacity, Math.max(0, parseFloat(fuel)));
        veh.fuel = fuel;
        // console.log("fuel set to", fuel);
    },
});
