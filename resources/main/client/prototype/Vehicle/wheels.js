import * as alt from "alt-client";
import * as native from "natives";
import { colors, serverColors, tireBrands, tireColors, wheelTypeList } from "../../data/index.js";

const FRONTWHEELS = 23; // Front Wheels
const REARWHEELS = 24; // Rear Wheels (Motorcycles)

alt.Vehicle.prototype.getWheelsData = function () {
    const type = native.getVehicleWheelType(this);
    const num = native.getVehicleMod(this, FRONTWHEELS);
    //  console.log(native.getVehicleMod(this, wheelsFront), native.getVehicleMod(this, wheelsRear));
    const color = native.getVehicleExtraColours(this, 1, 1)[2]; //  [void, pearl, color]
    const drift = native.getDriftTyresSet(this);

    ////  TEST
    // const camber = parseFloat(this.getWheelCamber(0).toFixed(2));
    // const track = [this.getWheelTrackWidth(0), this.getWheelTrackWidth(2)].map((value) => parseFloat(value.toFixed(2))); //  [Front, Rear]
    ////

    return { type, num, color, drift /* TEST , camber, track */ };
};

/**
 * @param {wheelsData} wheelsData
 */
alt.Vehicle.prototype.setWheels = function ({ type, num, color, drift /* TEST , camber, track */ }) {
    const vehClass = native.getVehicleClass(this);
    const customWheels = native.getVehicleModVariation(this, FRONTWHEELS);
    native.setVehicleWheelType(this, type);
    native.setVehicleMod(this, FRONTWHEELS, num, customWheels);
    if (vehClass === 8) native.setVehicleMod(this, REARWHEELS, num, customWheels);
    const pearl = native.getVehicleExtraColours(this, 1, 1)[1]; //  [void, pearl, color]
    native.setVehicleExtraColours(this, pearl, color);
    native.setDriftTyres(this, drift);
    /*
    ////    TEST
    if (!camber || !track) return;
    //  console.log("camber", camber);
    //  console.log("wheelsCount", this.wheelsCount);
    for (let wheelId = 0; wheelId < this.wheelsCount; wheelId++) {
        //  console.log("wheelId", wheelId, "camber", camber, "track", track);
        this.setWheelCamber(wheelId, camber);
        const i = native.floor(wheelId / 2);
        const width = track[i] || track[i - 1];
        this.setWheelTrackWidth(wheelId, width);
    }
    ////
    */
};

alt.Vehicle.prototype.setStockWheels = function () {
    this.setWheels({ type: 0, num: 0, color: 0, drift: false /* TEST , camber: 0, track: [0, 0] */ });
};
