import * as alt from "alt-client";
import * as native from "natives";
import * as utils from "./utils.js";

import "./prototypes.js";

const AMBIENT_TEMPERATURE = 20;

const wheelBones = ["wheel_lf", "wheel_rf", "wheel_lm1", "wheel_rm1", "wheel_lm2", "wheel_rm2", "wheel_lm3", "wheel_rm3", "wheel_lr", "wheel_rr"];
const player = alt.Player.local;

let tick;

/** @type {Map<alt.Vehicle, number[]>} */
const wearMap = new Map();

/**
 * @param {alt.Vehicle} vehicle
 */
function startTyreSimulation(vehicle) {
    if (tick) return;
    // tick = alt.setInterval(() => {
    //     if (!vehicle || !vehicle.valid) return;
    //     // for (let i = 0; i < vehicle.wheelsCount; i++) {
    //     //     const wear = vehicle.getTyreWear(i);
    //     // }

    //     vehicle.syncTyreWear();

    //     // return;
    //     // const tyres = Array.from({ length: vehicle.wheelsCount }, (v, i) => {
    //     //     // const wear = native.getTyreHealth(vehicle, i);
    //     //     return vehicle.getTyreWear(i);
    //     // });
    //     // console.log("tyres", tyres);
    // }, 1000);
}

alt.setInterval(() => {
    alt.Vehicle.streamedIn
        .filter((v) => v.netOwner === player)
        .forEach((vehicle) => {
            const wear = Array.from({ length: vehicle.wheelsCount }, (v, i) => vehicle.getTyreWear(i));
            if (wearMap.has(vehicle)) {
                const prevWear = wearMap.get(vehicle);
                if (prevWear.every((v, i) => v === wear[i])) {
                    console.log("no change");
                    return;
                }
            }
            wearMap.set(vehicle, wear);
            alt.emitServer("vehicle:tyre:sync", vehicle, wear);
            // vehicle.syncTyreWear();
        });
}, 1000);

/**
 * @param {alt.Vehicle} vehicle
 */
function stopTyreSimulation(vehicle) {
    if (!tick) return;
    alt.clearInterval(tick);
    tick = null;
    // vehicle.syncTyres();
}

// alt.onServer(
//     "vehicle:tyres:init",
//     /**
//      * @param {alt.Vehicle} vehicle
//      */
//     async (vehicle) => {
//         await utils.waitForVehicleSpawn(vehicle);
//         alt.log(vehicle, vehicle.wheelsCount);
//         // const tyres = utils.getWheelsIndexes(vehicle).map((v, i) => [v, native.getTyreHealth(vehicle, v)]);
//         const tyres = utils.getWheelsIndexes(vehicle).map((v) => {
//             return {
//                 wear: native.getTyreHealth(vehicle, v),
//             };
//         });
//         alt.emitServer("vehicle:tyres:init", vehicle, tyres);
//     }
// );

// alt.on("drivingCar", (state, vehicle) => {
//     // console.log("wear1", vehicle.getStreamSyncedMeta("tyre:wear:0"));
//     if (state) {
//         Array.from({ length: 8 }, (v, i) => {
//             native.setTyreHealth(vehicle, i, 500);
//             native.setTyreWearRate(vehicle, i, 10);
//         });

//         // alt.setInterval(() => {
//         //     native.setTyreWearRate(vehicle, 0, 1);
//         //     native.setTyreWearRateScale(vehicle, 0, 1);
//         //     // console.log(native.getTyreHealth(vehicle, 0));
//         // }, 1000);
//     }
// });

// alt.setInterval(() => {
//     const vehicle = alt.Player.local.vehicle;
//     if (!vehicle) return;
//     const t = Array.from({ length: vehicle.wheelsCount }, (v, i) => native.getTyreHealth(vehicle, utils.convertIndex(vehicle, i)));
//     console.log("health", t);
// }, 1000);

// alt.on("resourceStart", () => {
//     const veh = player.vehicle;
//     if (!veh) return;
//     native.setVehicleTyreBurst(veh, 0, true, 1000);
//     return;
//     const wheelBoneIds = wheelBones.map((bone) => {
//         return native.getEntityBoneIndexByName(veh, bone);
//     });
//     const bone = wheelBoneIds[0];
//     const pos = native.getEntityBonePostion(veh, bone);
//     const rot = native.getEntityBoneRotation(veh, bone);
//     console.log("pos", pos.toString(), "rot", rot.toString());
//     const pos2 = native.getEntityBoneObjectPostion(veh, bone);
//     const rot2 = native.getEntityBoneObjectRotation(veh, bone);
//     console.log("pos", pos2.toString(), "rot", rot2.toString());
//     const worldPos = native.getWorldPositionOfEntityBone(veh, bone);
//     console.log("worldPos", worldPos.toString());
// });

// alt.onServer("vehicle:tyre:unmount", (vehicle, index) => {
//     native.setVehicleTyreBurst(vehicle, index, true, 1000);
// });

alt.onServer(
    "vehicle:getWheelsPos",
    /**
     * @param {alt.Vehicle} vehicle
     */
    (vehicle) => {
        const wheelIndexes = utils.getWheelsIndexes(vehicle);
        const wheelBones = wheelIndexes.map((i) => native.getEntityBoneIndexByName(vehicle, utils.convertWheelIndexToBone(i)));
        const wheelPos = wheelBones.map((bone) => native.getEntityBonePostion(vehicle, bone));
        alt.emitServer("vehicle:wheelsPos", vehicle, wheelPos);
    }
);

alt.on("drivingCar", (state, vehicle) => {
    if (state) startTyreSimulation(vehicle);
    else stopTyreSimulation();
});
