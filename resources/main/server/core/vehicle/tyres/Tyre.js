import * as alt from "alt-server";

export default class Tyre extends alt.Object {
    static #PHYSICAL_PROP = "prop_wheel_tyre";
    // static #PHYSICAL_PROP = "prop_rub_tyre_02";

    /** @returns {number} */
    get wear() {
        return this.getStreamSyncedMeta("tyre:wear");
    }
    /** @param {number} value */
    set wear(value) {
        this.setStreamSyncedMeta("tyre:wear", value);
    }

    /** @returns {number} */
    get wearRate() {
        return this.getStreamSyncedMeta("tyre:wearRate");
    }
    /** @param {number} value */
    set wearRate(value) {
        this.setStreamSyncedMeta("tyre:wearRate", value);
    }

    /** @returns {number} */
    get scale() {
        return this.getStreamSyncedMeta("tyre:scale");
    }
    /** @param {number} value */
    set scale(value) {
        this.setStreamSyncedMeta("tyre:scale", value);
    }

    /** @returns {number} */
    get pressure() {
        return this.getStreamSyncedMeta("tyre:pressure");
    }
    /** @param {number} value */
    set pressure(value) {
        this.setStreamSyncedMeta("tyre:pressure", value);
    }

    /** @return {number} */
    get temperature() {
        return this.getStreamSyncedMeta("tyre:temperature");
    }
    /** @param {number} value */
    set temperature(value) {
        this.setStreamSyncedMeta("tyre:temperature", value);
    }

    /** @returns {alt.Object} */
    get tyreProp() {
        return this.getMeta("tyreProp");
    }
    /** @param {alt.Object} value */
    set tyreProp(value) {
        this.setMeta("tyreProp", value);
    }

    /**
     * @param {string} model
     * @param {alt.Vector3} pos
     * @param {alt.Vector3} rot
     * @param {number} wear
     * @param {number} wearRate
     * @param {number} scale
     * @returns {Tyre}
     */
    constructor(model, pos, rot, wear, wearRate, scale, pressure, temperature) {
        super(Tyre.#PHYSICAL_PROP, pos, rot);
        this.alpha = 0;
        this.wear = wear;
        this.wearRate = wearRate;
        this.scale = scale;
        this.pressure = pressure;
        this.temperature = temperature;
        const rotFix = new alt.Vector3(Math.PI / 2, Math.PI / 2, 0);
        this.tyreProp = new alt.Object(model, pos, alt.Vector3.zero);
        this.tyreProp.attachTo(this, 0, 0, alt.Vector3.zero, rotFix, false, false);
        this.setMeta("type", "tyre");
    }

    destroy() {
        this.tyreProp.destroy();
        super.destroy();
    }

    // /**
    //  * @param {string} model
    //  * @param {alt.Vector3} pos
    //  * @param {alt.Vector3} rot
    //  * @param {number} wear
    //  * @param {number} wearRate
    //  * @param {number} scale
    //  * @returns {Tyre}
    //  */
    // static createOnProp(model, pos, rot, wear, wearRate, scale, pressure, temperature) {
    //     const entity = new alt.Object(model, pos, rot);
    //     Object.setPrototypeOf(entity, Tyre.prototype);
    //     entity.frozen = true;
    //     entity.collision = true;
    //     entity.wear = wear;
    //     entity.wearRate = wearRate;
    //     entity.scale = scale;
    //     entity.pressure = pressure;
    //     entity.temperature = temperature;
    //     return entity;
    // }

    // /**
    //  * @param {alt.Vehicle} vehicle
    //  * @param {number} index
    //  */
    // mount(vehicle, index) {
    //     if (vehicle.hasTyre(index)) {
    //         alt.logWarning(`Vehicle ${vehicle.id} already has tyre ${index}`);
    //         return;
    //     }
    //     vehicle.setTyreWear(index, this.health);
    //     vehicle.setTyreWearRate(index, this.wearRate);
    //     vehicle.setTyreWearRateScale(index, this.scale);
    //     vehicle.setTyreHeat(index, this.heat);
    //     this.destroy();
    //     console.log(vehicle.tyres);
    // }
}
