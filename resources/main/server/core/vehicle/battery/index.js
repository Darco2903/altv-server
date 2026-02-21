import * as alt from "alt-server";
import VehicleBattery from "./VehicleBattery.js";
import BatteryPrototype from "./BatteryPrototype.js";

const CHARGE_TIMEOUT_TIME = 10_000;

const DEFAULT_BATTERY_CAPACITY = 40;
const DEFAULT_BATTERY_CHARGE = 40;

Object.setPrototypeOf(alt.Vehicle.prototype, BatteryPrototype.prototype);

alt.on("vehicle:spawned", (vehicle) => {
    // console.log("battery valid (vehicle):", vehicle.hasStreamSyncedMeta("battery:capacity"));
    VehicleBattery.createInVehicle(vehicle, "prop_car_battery_01", DEFAULT_BATTERY_CAPACITY, DEFAULT_BATTERY_CHARGE);
    // // console.log("is battery valid:", vehicle.battery.valid);
    // console.log("battery valid (vehicle):", vehicle.hasStreamSyncedMeta("battery:capacity"));
});

// prop_battery_01
// prop_battery_02
// prop_car_battery_01

alt.onClient("battery:setCharge", (player, entity, value) => {
    // console.log("setCharge:", value);
    if (!entity || !entity.valid) return;
    VehicleBattery.setCharge(entity, value);
});

alt.on("resourceStart", () => {
    alt.setInterval(() => {
        alt.Vehicle.all.forEach((veh) => {
            if (veh.engineOn && !veh.driver && veh.hasBattery && !veh.isBatteryFull) {
                VehicleBattery.setCharge(veh, veh.batteryCharge + (0.06 / 1000) * CHARGE_TIMEOUT_TIME);
                if (veh.batteryCharge > veh.batteryCapacity) {
                    VehicleBattery.setCharge(veh, veh.batteryCapacity);
                }
            }
        });
    }, CHARGE_TIMEOUT_TIME);
});

alt.Utils.Chat.registerCmd({
    name: "setBattery",
    args: [
        {
            name: "battery",
            type: "number",
            required: true,
        },
    ],
    execute: (player, [battery = 0]) => {
        const veh = player.vehicle;
        if (!veh) return;
        battery = Math.min(veh.batteryCapacity, Math.max(0, parseFloat(battery)));
        veh.batteryCharge = battery;
    },
});

// alt.Utils.Chat.registerCmd({
//     name: "createVehicleBattery",
//     args: [
//         {
//             name: "charge",
//             type: "number",
//             required: false,
//         },
//         {
//             name: "capacity",
//             type: "number",
//             required: false,
//         },
//     ],
//     execute: (player, [charge = 100, capacity = 100]) => {
//         const veh = alt.Vehicle.all[0];
//         if (!veh) return;
//         VehicleBattery.createInVehicle(veh, "prop_car_battery_01", capacity, charge);
//     },
// });

// alt.Utils.Chat.registerCmd({
//     name: "createPropBattery",
//     args: [
//         {
//             name: "charge",
//             type: "number",
//             required: false,
//         },
//         {
//             name: "capacity",
//             type: "number",
//             required: false,
//         },
//     ],
//     execute: (player, [charge = 100, capacity = 100]) => {
//         const veh = alt.Vehicle.all[0];
//         if (!veh) return;
//         const propPos = veh.pos.add(0, 0, 1);
//         VehicleBattery.createInProp("prop_car_battery_01", propPos, alt.Vector3.zero, capacity, charge);
//     },
// });

// alt.Utils.Chat.registerCmd({
//     name: "toProp",
//     args: [],
//     execute: (player) => {
//         const veh = alt.Vehicle.all[0];
//         if (!veh) return;
//         const propPos = veh.pos.add(0, 0, 1);
//         const prop = VehicleBattery.toProp(veh, propPos, alt.Vector3.zero);
//         console.log("toProp:", prop);
//     },
// });

// alt.Utils.Chat.registerCmd({
//     name: "toVehicle",
//     args: [],
//     execute: (player) => {
//         const veh = alt.Vehicle.all[0];
//         if (!veh) return;
//         const prop = alt.Object.all.find((obj) => obj.valid && obj.hasStreamSyncedMeta("battery:capacity"));
//         if (!prop) return;
//         VehicleBattery.toVehicle(prop, veh);
//     },
// });

// alt.Utils.Chat.registerCmd({
//     name: "destroyVehicleBattery",
//     args: [],
//     execute: (player) => {
//         const veh = alt.Vehicle.all[0];
//         if (!veh) return;
//         VehicleBattery.remove(veh);
//     },
// });

// alt.Utils.Chat.registerCmd({
//     name: "destroyPropBattery",
//     args: [],
//     execute: (player) => {
//         const prop = alt.Object.all.find((obj) => obj.valid && obj.hasStreamSyncedMeta("battery:capacity"));
//         if (!prop) return;
//         prop.destroy();
//     },
// });

// alt.Utils.Chat.registerCmd({
//     name: "deleteAllBatteries",
//     args: [],
//     execute: (player) => {
//         alt.Vehicle.all.forEach((veh) => {
//             if (veh.hasStreamSyncedMeta("battery:capacity")) {
//                 VehicleBattery.remove(veh);
//             }
//         });
//         alt.Object.all.forEach((obj) => {
//             obj.destroy();
//         });
//     },
// });
