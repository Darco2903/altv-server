import * as alt from "alt-server";
import * as utils from "./utils.js";
import Tyre from "./Tyre.js";
import wheelsCountFix from "./wheelsCountFix.js";

import "./prototypes.js";

const DEFAULT_WEAR = 800;
const DEFAULT_WEAR_RATE = 1;
const DEFAULT_WEAR_RATE_SCALE = 1;
const DEFAULT_PRESSURE = 2;
const DEFAULT_TEMPERATURE = 20;
/**
 * @param {alt.Vehicle} vehicle
 */
async function initTyres(vehicle) {
    // const onOwner = (entity, owner, oldOwner) => {
    //     if (entity === vehicle && owner) {
    //         alt.off("netOwnerChange", onOwner);
    //         alt.emitClient(owner, "vehicle:tyres:init", vehicle);
    //     }
    // };
    // alt.on("netOwnerChange", onOwner);

    for (let i = 0; i < vehicle.wheelsCount; i++) {
        vehicle.setTyreWear(i, DEFAULT_WEAR);
        vehicle.setTyreWearRate(i, DEFAULT_WEAR_RATE);
        vehicle.setTyreWearRateScale(i, DEFAULT_WEAR_RATE_SCALE);
        vehicle.setTyrePressure(i, DEFAULT_PRESSURE);
        vehicle.setTyreTemperature(i, DEFAULT_TEMPERATURE);
    }

    // alt.setInterval(() => {
    //     let tyres = [];
    //     for (let i = 0; i < vehicle.wheelsCount; i++) {
    //         tyres.push(vehicle.getTyreWear(0));
    //     }
    //     console.log("wear", tyres);
    // }, 1000);
    // console.log(vehicle.tyres);
}

// alt.onClient(
//     "vehicle:tyres:init",
//     /**
//      * @param {alt.Player} player
//      * @param {alt.Vehicle} vehicle
//      * @param {Map<number, import("./Tyre.js").TyreData>} tyres
//      */
//     (player, vehicle, tyres) => {
//         // console.log("initTyres", vehicle, tyres);
//         tyres.forEach((tyre, index) => {
//             vehicle.setTyreWear(index, tyre.wear);
//             vehicle.setTyreWearRate(index, tyre.wearRate);
//             vehicle.setTyreWearRateScale(index, tyre.scale);
//             vehicle.setTyrePressure(index, tyre.pressure);
//             vehicle.setTyreTemperature(index, tyre.temperature);
//         });
//     }
// );

alt.onClient(
    "vehicle:tyre:sync",
    /**
     * @param {alt.Player} player
     * @param {alt.Vehicle} vehicle
     * @param {number[]} wear
     */
    (player, vehicle, wear) => {
        if (!vehicle?.valid) return;
        // if (vehicle.id !== 1) return;
        console.log("sync", vehicle.id, wear);
        wear.forEach((w, i) => {
            if (!vehicle.hasTyre(i)) return;
            vehicle.setTyreWear(i, w);
        });
    }
);

alt.on("vehicle:spawned", async (vehicle) => {
    wheelsCountFix(vehicle);
    await alt.Utils.wait(500);
    initTyres(vehicle);
});

alt.on("resourceStart", () => {});

alt.Utils.Chat.registerCmd({
    name: "propTest",
    args: [],
    permissionLevel: 2,
    execute: async (player, [model = "v_ind_cm_tyre07"]) => {
        const data = await utils.getWheelsPos(player.vehicle);
        const heading = player.vehicle.rot.z;
        const forward = new alt.Vector3(Math.cos(heading), Math.sin(heading), 0);
        const rot = player.vehicle.rot.add(0, 0, Math.PI / 2);

        data.forEach((pos, i) => {
            if (i % 2 === 0) pos = pos.sub(forward.x, forward.y, 0);
            else pos = pos.add(forward.x, forward.y, 0);
            pos.sub(0, 0, 0.5);
            const tyre = new Tyre(model, pos, rot, DEFAULT_WEAR, DEFAULT_WEAR_RATE, DEFAULT_WEAR_RATE_SCALE, DEFAULT_PRESSURE, DEFAULT_TEMPERATURE);
        });
    },
});

alt.on("resourceStart", () => {
    alt.Vehicle.all.forEach(wheelsCountFix);
    alt.Object.all.forEach((obj) => {
        if (obj.getMeta("type") === "tyre") {
            Object.setPrototypeOf(obj, Tyre.prototype);
        }
    });
    return;
    const veh = alt.Vehicle.all[0];
    if (!veh) return;
    // utils.detachVehicleWheel(veh, 0);

    return;
    const model = "v_ind_cm_tyre06";
    // const model = "v_ind_cm_tyre07";
    const pos = veh.pos.add(2, 2, 0);
    const rot = alt.Vector3.zero;
    const tyre1 = Tyre.createOnProp(model, pos, rot, 29, 1, 1);
    const tyre2 = Tyre.createOnProp(model, pos, rot, 56, 1, 1);

    alt.setTimeout(() => {
        console.log("mounting tyre");
        tyre1.mount(veh, 0);
        tyre2.mount(veh, 1);
    }, 2000);
});

// alt.on("resourceStop", () => {
//     alt.Object.all.forEach((obj) => {
//         // obj.destroy();
//         if (obj.valid && obj.getMeta("type") === "tyre") {
//             obj.destroy();
//         }
//     });
// });

// alt.Utils.Chat.registerCmd({
//     name: "tyre",

// })

// alt.on("resourceStart", () => {
//     alt.Object.all.forEach((obj) => {
//         obj.destroy();
//     });
// });

alt.Utils.Chat.registerCmd({
    name: "deleteAllTyres",
    description: "Deletes all tyres",
    permissionLevel: 2,
    execute: (player) => {
        alt.Object.all.forEach((obj) => {
            if (obj.valid && obj.getMeta("type") === "tyre") {
                obj.destroy();
            }
        });
    },
});

alt.Utils.Chat.registerCmd({
    name: "unmountTyre",
    description: "Unmounts tyre from vehicle",
    args: [
        {
            name: "tyreIndex",
            description: "Tyre index",
            type: "number",
            required: true,
        },
    ],
    permissionLevel: 1,
    execute: async (player, [tyreIndex]) => {
        const veh = player.vehicle;
        if (!veh || isNaN(tyreIndex)) return;
        if (!veh.hasTyre(tyreIndex)) {
            alt.logWarning(`Vehicle ${veh.id} does not have tyre ${tyreIndex}`);
            return;
        }
        // console.log("onVeh", tyreIndex, veh.getTyreWear(tyreIndex));
        // console.log("hasTyre", veh.hasTyre(tyreIndex));
        const poss = await utils.getWheelsPos(veh);
        const heading = player.vehicle.rot.z;
        const forward = new alt.Vector3(Math.cos(heading), Math.sin(heading), 0);
        const pos = tyreIndex % 2 === 0 ? (poss[tyreIndex] = poss[tyreIndex].sub(forward.x, forward.y, 0)) : poss[tyreIndex].add(forward.x, forward.y, 0);
        const tyre = veh.unMountTyre(tyreIndex, pos);
        // console.log("onTyre", tyreIndex, tyre.wear);
        // console.log("hasTyre", veh.hasTyre(tyreIndex));
        alt.setTimeout(() => {
            tyre.destroy();
        }, 5000);
    },
});

alt.Utils.Chat.registerCmd({
    name: "mountTyre",
    description: "Mounts tyre to vehicle",
    args: [
        {
            name: "tyreIndex",
            description: "Tyre index",
            type: "number",
            required: true,
        },
    ],
    permissionLevel: 1,
    execute: async (player, [tyreIndex]) => {
        const veh = player.vehicle;
        if (!veh || isNaN(tyreIndex)) return;
        if (veh.hasTyre(tyreIndex)) {
            alt.logWarning(`Vehicle ${veh.id} already has tyre ${tyreIndex}`);
            return;
        }
        const poss = await utils.getWheelsPos(veh);
        const heading = player.vehicle.rot.z;
        const forward = new alt.Vector3(Math.cos(heading), Math.sin(heading), 0);
        const pos = tyreIndex % 2 === 0 ? (poss[tyreIndex] = poss[tyreIndex].sub(forward.x, forward.y, 0)) : poss[tyreIndex].add(forward.x, forward.y, 0);
        const rot = veh.rot.add(0, 0, Math.PI / 2);
        const tyre = new Tyre("v_ind_cm_tyre06", pos, rot, DEFAULT_WEAR, DEFAULT_WEAR_RATE, DEFAULT_WEAR_RATE_SCALE, DEFAULT_PRESSURE, DEFAULT_TEMPERATURE);
        await alt.Utils.wait(2000);
        veh.mountTyre(tyreIndex, tyre);
        // console.log(tyreIndex, veh.tyres[tyreIndex]);
    },
});
