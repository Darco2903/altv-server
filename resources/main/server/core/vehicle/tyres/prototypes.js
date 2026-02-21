import * as alt from "alt-server";
// import * as utils from "./utils.js";
import Tyre from "./Tyre.js";

alt.Vehicle.prototype.getTyre = function (index) {
    return {
        wear: this.getTyreWear(index),
        wearRate: this.getTyreWearRate(index),
        scale: this.getTyreWearRateScale(index),
        pressure: this.getTyrePressure(index),
        temperature: this.getTyreTemperature(index),
    };
};

Object.defineProperty(alt.Vehicle.prototype, "tyres", {
    get() {
        return Array.from({ length: this.wheelsCount }, (v, i) => this.getTyre(i));
        // return Array.from({ length: this.wheelsCount }, (v, i) => {
        //     if (this.hasTyre(i)) return this.getTyre(i);
        // });
    },
    set(tyres) {
        alt.logWarning("Setting tyres is not supported");
    },
});

alt.Vehicle.prototype.getTyreWear = function (index) {
    return this.getStreamSyncedMeta(`tyre:wear:${index}`);
};

alt.Vehicle.prototype.setTyreWear = function (index, wear) {
    this.setStreamSyncedMeta(`tyre:wear:${index}`, wear);
};

alt.Vehicle.prototype.setTyreWearRate = function (index, wearRate) {
    this.setStreamSyncedMeta(`tyre:wearRate:${index}`, wearRate);
};

alt.Vehicle.prototype.getTyreWearRate = function (index) {
    return this.getStreamSyncedMeta(`tyre:wearRate:${index}`);
};

alt.Vehicle.prototype.setTyreWearRateScale = function (index, scale) {
    this.setStreamSyncedMeta(`tyre:scale:${index}`, scale);
};

alt.Vehicle.prototype.getTyreWearRateScale = function (index) {
    return this.getStreamSyncedMeta(`tyre:scale:${index}`);
};

alt.Vehicle.prototype.getTyreTemperature = function (index) {
    return this.getStreamSyncedMeta(`tyre:temperature:${index}`);
};

alt.Vehicle.prototype.getTyrePressure = function (index) {
    return this.getStreamSyncedMeta(`tyre:pressure:${index}`);
};

alt.Vehicle.prototype.setTyrePressure = function (index, pressure) {
    this.setStreamSyncedMeta(`tyre:pressure:${index}`, pressure);
};

alt.Vehicle.prototype.setTyreTemperature = function (index, temperature) {
    this.setStreamSyncedMeta(`tyre:temperature:${index}`, temperature);
};

alt.Vehicle.prototype.hasTyre = function (index) {
    return this.hasStreamSyncedMeta(`tyre:wear:${index}`);
};

alt.Vehicle.prototype.mountTyre =
    /**
     * @param {number} index
     * @param {Tyre} tyre
     */
    function (index, tyre) {
        this.setTyreWear(index, tyre.wear);
        this.setTyreWearRate(index, tyre.wearRate);
        this.setTyreWearRateScale(index, tyre.scale);
        this.setTyrePressure(index, tyre.pressure);
        this.setTyreTemperature(index, tyre.temperature);
        tyre.destroy();
        console.log(this.tyres);
    };

alt.Vehicle.prototype.unMountTyre = function (index, pos = this.pos) {
    // const tyre = Tyre.createOnProp(
    //     "v_ind_cm_tyre06",
    //     this.pos.add(2),
    //     this.rot,
    //     this.getTyreWear(index),
    //     this.getTyreWearRate(index),
    //     this.getTyreWearRateScale(index),
    //     this.getTyrePressure(index),
    //     this.getTyreTemperature(index)
    // );
    const tyre = new Tyre(
        "v_ind_cm_tyre06",
        pos,
        this.rot.add(0, 0, Math.PI / 2),
        this.getTyreWear(index),
        this.getTyreWearRate(index),
        this.getTyreWearRateScale(index),
        this.getTyrePressure(index),
        this.getTyreTemperature(index)
    );
    this.deleteStreamSyncedMeta(`tyre:wear:${index}`);
    this.deleteStreamSyncedMeta(`tyre:wearRate:${index}`);
    this.deleteStreamSyncedMeta(`tyre:scale:${index}`);
    this.deleteStreamSyncedMeta(`tyre:pressure:${index}`);
    this.deleteStreamSyncedMeta(`tyre:temperature:${index}`);
    // this.tyres.delete(index);
    return tyre;
};
