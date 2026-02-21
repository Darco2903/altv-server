import * as alt from "alt-client";
import * as native from "natives";

import * as utils from "./utils.js";

// Object.defineProperty(alt.Vehicle.prototype, "tyres", {
//     get() {
//         const indexes = utils.getWheelsIndexes(this);
//         return indexes.map((index) => {
//             return {
//                 wear: this.getTyreWear(index),
//             };
//         });
//     },
//     // set(value) {
//     //     this.setMeta("tyres", value);
//     // },
// });

alt.Vehicle.prototype.getTyreWear = function (index) {
    const convertedIndex = utils.convertIndex(this, index);
    return native.getTyreHealth(this, convertedIndex);
};

alt.Vehicle.prototype.setTyreWear = function (index, wear) {
    const convertedIndex = utils.convertIndex(this, index);
    console.log("setTyreWear", index, `(converted: ${convertedIndex})`, typeof wear, wear);
    // native.setVehicleTyreFixed(this, convertedIndex);
    // native.setTyreMaximumGripDifferenceDueToWearRate()
    // const rate = this.getTyreWearRate(index);
    // const scale = this.getTyreWearRateScale(index);
    // console.log("rate", rate, "scale", scale);
    // native.setTyreWearRate(this, convertedIndex, 1);
    // native.setTyreWearRateScale(this, convertedIndex, 1);
    // native.setVehicleTyreBurst(this, convertedIndex, false, 1000);
    // native.setVehicleTyresCanBurst(this, false);
    // native.setVehicleTyresCanBurst(this, true);
    // native.setVehicleTyreFixed(this, convertedIndex);
    native.setTyreHealth(this, convertedIndex, wear);
};

alt.Vehicle.prototype.getTyreWearRate = function (index) {
    const convertedIndex = utils.convertIndex(this, index);
    return native.getTyreWearRate(this, convertedIndex);
};

alt.Vehicle.prototype.setTyreWearRate = function (index, wearRate) {
    const convertedIndex = utils.convertIndex(this, index);
    native.setTyreWearRate(this, convertedIndex, wearRate);
};

alt.Vehicle.prototype.getTyreWearRateScale = function (index) {
    const convertedIndex = utils.convertIndex(this, index);
    return native.getTyreWearRate(this, convertedIndex);
};

alt.Vehicle.prototype.setTyreWearRateScale = function (index, scale) {
    const convertedIndex = utils.convertIndex(this, index);
    native.setTyreWearRate(this, convertedIndex, scale);
};

alt.Vehicle.prototype.getTyrePressure = function (index) {
    return this.getStreamSyncedMeta(`tyre:pressure:${index}`);
};

alt.Vehicle.prototype.setTyrePressure = function (index, pressure) {
    alt.emitServer("vehicle:tyre:pressure", this, index, pressure);
};

alt.Vehicle.prototype.getTyreTemperature = function (index) {
    return this.getStreamSyncedMeta(`tyre:temperature:${index}`);
};

alt.Vehicle.prototype.setTyreTemperature = function (index, temperature) {
    alt.emitServer("vehicle:tyre:temperature", this, index, temperature);
};

// alt.Vehicle.prototype.syncTyres = function () {
//     const tyres = utils.getWheelsIndexes(this).map((index) => {
//         return {
//             wear: this.getTyreWear(index),
//             wearRate: this.getTyreWearRate(index),
//             scale: this.getTyreWearRateScale(index),
//             pressure: this.getTyrePressure(index),
//             temperature: this.getTyreTemperature(index),
//         };
//     });
//     alt.emitServer("vehicle:tyres:sync", this, tyres);
// };

alt.Vehicle.prototype.syncTyreWear = function () {
    const wear = Array.from({ length: this.wheelsCount }, (v, i) => this.getTyreWear(i));
    alt.emitServer("vehicle:tyre:sync", this, wear);
};

alt.on("streamSyncedMetaChange", (entity, key, value, oldValue) => {
    if (!key.startsWith("tyre:")) return;
    /** @type {alt.Vehicle} */
    const veh = entity;
    const index = parseInt(key.charAt(key.length - 1));
    // if (key.startsWith("tyre:wear")) {
    //     const index = parseInt(key.charAt(key.length - 1));
    //     if (value === undefined) {
    //         native.setVehicleTyreBurst(veh, index, true, 1000);
    //     } else {
    //         native.setVehicleTyreBurst(veh, index, false, 1000);
    //         native.setTyreHealth(veh, index, value);
    //     }
    // }

    if (key.startsWith("tyre:wear:")) {
        if (!value) {
            const convertedIndex = utils.convertIndex(veh, index);
            native.setVehicleTyreBurst(veh, convertedIndex, true, 1000);
        } else {
            if (!oldValue) {
            }
            // console.log(veh.getTyreWearRate(index), veh.getTyreWearRateScale(index));
            // veh.setTyreWearRate(index, veh.getTyreWearRate(index));
            // veh.setTyreWearRateScale(index, veh.getTyreWearRateScale(index));
            veh.setTyreWear(index, value);
        }
        return;
    }

    if (!value) value = 0;
    if (key.startsWith("tyre:wearRate:")) {
        veh.setTyreWearRate(index, value);
    } else if (key.startsWith("tyre:scale:")) {
        veh.setTyreWearRateScale(index, value);
    }
    //  else if (key.startsWith("tyre:pressure:")) {
    //     veh.setTyrePressure(index, value);
    // } else if (key.startsWith("tyre:temperature:")) {
    //     veh.setTyreTemperature(index, value);
    // }
});
