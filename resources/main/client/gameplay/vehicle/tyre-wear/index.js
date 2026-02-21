import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;
let updateTick;

// /** @type {number[]} */
// let tyreWearRate;

/** @type {Array<boolean>} */
let tyreBurst = [];
let enabled = true;

const view = new alt.WebView("http://resource/client/gameplay/vehicle/tyre-wear/index.html", true);
view.isVisible = false;

async function toggle(state) {
    if (!enabled) return;
    // await new Promise((resolve) => setTimeout(resolve, 100));
    view.isVisible = state;
    if (state && player.vehicle && !updateTick) {
        // const wheelIndexes = vehicle.getWheelsIndexes();
        // view.emit("tyres:select", wheelIndexes);
        view.emit("tyres:numberOfWheels", player.vehicle.wheelsCount);
        // vehicle.setTyresWearRate(vehicle.getStreamSyncedMeta("tyres:wearRate"));
        // vehicle.setTyresWear(vehicle.getStreamSyncedMeta("tyres:health"));
        // tyreBurst = vehicle.getTyresBurst();
        updateTick = alt.everyTick(() => {
            const vehicle = player.vehicle;
            native.hideStreetAndCarNamesThisFrame();
            if (!vehicle) return;

            for (let i = 0; i < vehicle.wheelsCount; i++) {
                const wear = vehicle.getTyreWear(i);
                view.emit("tyres:update", i, wear);
            }
            // const wear = vehicle.getTyresWear();
            // wheelIndexes.forEach((wheelIndex, i) => {
            //     view.emit("tyres:update", wheelIndex, wear[i]);
            // });

            // const burst = vehicle.getTyresBurst();
            // if (burst.some((b, i) => b && !tyreBurst[i])) {
            //     // console.log("burst", burst);
            //     vehicle.syncTyresWear();
            //     tyreBurst = burst;
            // }
        });
    } else if (!state && updateTick) {
        alt.clearEveryTick(updateTick);
        updateTick = null;
    }
}

alt.on("resourceStart", () => {
    // if (player.seat === 1) player.vehicle.syncTyresWear();
});

// alt.on("leftVehicle", (vehicle, seat) => {
//     if (vehicle.hasMeta("toDelete")) return;
//     if (seat === 1) vehicle.syncTyresWear();
// });

alt.on("drivingCar", toggle);

// /**
//  * @param {alt.Vehicle} vehicle
//  * @returns {Array<number>}
//  */
// function getWheelIndexes(vehicle) {
//     switch (vehicle.wheelsCount) {
//         case 2:
//             return [0, 4];
//         case 3:
//             return [0, 1, 4];
//         case 4:
//             return [0, 1, 4, 5];
//         default:
//             return [0, 1, 2, 3, 4, 5];
//     }
// }

// /**
//  * @param {alt.Vehicle} vehicle
//  * @param {Array<number>} wearRate
//  */
// function setTyreWearRate(vehicle, wearRate) {
//     const wheelIndexes = getWheelIndexes(vehicle);
//     wheelIndexes.forEach((wheelIndex, i) => {
//         native.setTyreWearRate(vehicle, wheelIndex, wearRate[i] === 0 ? 0 : 1);
//         native.setTyreWearRateScale(vehicle, wheelIndex, wearRate[i]);
//     });
// }

// /**
//  * @param {alt.Vehicle} vehicle
//  * @param {Array<number>} wear
//  */
// function setTyreHealth(vehicle, wear) {
//     const wheelIndexes = getWheelIndexes(vehicle);
//     wheelIndexes.forEach((wheelIndex, i) => native.setTyreHealth(vehicle, wheelIndex, wear[i]));
// }

// /**
//  * @param {alt.Vehicle} vehicle
//  * @returns {Array<number>}
//  */
// function getTyreHealth(vehicle) {
//     const wheelIndexes = getWheelIndexes(vehicle);
//     return wheelIndexes.map((wheelIndex) => native.getTyreHealth(vehicle, wheelIndex));
// }

// /**
//  * @param {alt.Vehicle} vehicle
//  */
// function syncTyreHealth(vehicle) {
//     const wear = getTyreHealth(vehicle);
//     alt.emitServer("tyreWear:health", vehicle, wear);
// }

// /**
//  * @param {alt.Vehicle} vehicle
//  * @returns {Array<boolean>}
//  */
// function getTyreBurst(vehicle) {
//     const health = getTyreHealth(vehicle);
//     return health.map((h) => h < 10);
// }

// alt.on("vehicle:initDefaultValues", async (vehicle) => {
//     const driveBiasFront = vehicle.handling.driveBiasFront;
//     alt.emitServer("vehicle:setDefaultValues", vehicle, {
//         driveBiasFront,
//     });
// });

// alt.on("streamSyncedMetaChange", async (entity, key, value) => {
//     // if (entity.type !== 1 || (entity === player.vehicle && player.seat === 1)) return;
//     if (entity.type !== 1) return;
//     await alt.Utils.waitFor(() => entity.isSpawned, 1000);
//     switch (key) {
//         case "tyreWear:health":
//             setTyreHealth(entity, value);
//             console.log("tyreWear:health", value);
//             break;
//     }
// });

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// alt.on("enteredVehicle", (vehicle, seat) => {
//     if (vehType.includes(native.getVehicleClass(vehicle))) {
//         const scale = player.vehicle.hasStreamSyncedMeta("tyreWear:wearRate")
//             ? player.vehicle.getStreamSyncedMeta("tyreWear:wearRate")
//             : // : [2, 2, 1, 1, 1, 1];
//               // : [20, 20, 10, 10, 10, 10];
//               [5, 5, 2.5, 2.5, 2.5, 2.5];
//         // : new Array(6).fill(0)
//         setTyreWearRate(vehicle, scale);

//         const wear = player.vehicle.hasStreamSyncedMeta("tyreWear:health")
//             ? player.vehicle.getStreamSyncedMeta("tyreWear:health")
//             : [1000, 1000, 1000, 1000, 1000, 1000];
//         setTyreHealth(vehicle, wear);

//         if (seat === 1) {
//             toggle(true);
//             // if (!player.vehicle.hasStreamSyncedMeta("tyreWear:wearRate")) {
//             syncTyreWearRate(vehicle);
//             syncTyreHealth(vehicle);
//             // }
//         }
//     }
// });
