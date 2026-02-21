import * as alt from "alt-server";

export default class Battery extends alt.Entity {
    /** @type {Set<Battery>} */
    static all = new Set();
    static get all() {
        return Battery.all;
    }

    /** @type {number} */
    #chargeInterval;

    /** @return {number} */
    get capacity() {
        return this.getStreamSyncedMeta("battery:capacity");
    }

    /** @param {number} value */
    set capacity(value) {
        this.setStreamSyncedMeta("battery:capacity", value);
    }

    /** @return {number} */
    get charge() {
        return this.getStreamSyncedMeta("battery:charge");
    }

    /** @param {number} value */
    set charge(value) {
        this.setStreamSyncedMeta("battery:charge", value);
    }

    /** @return {number} */
    get health() {
        return this.getStreamSyncedMeta("battery:health");
    }

    /** @param {number} value */
    set health(value) {
        this.setStreamSyncedMeta("battery:health", value);
    }

    /** @return {boolean} */
    get isCharging() {
        return this.getStreamSyncedMeta("battery:isCharging");
    }

    /** @param {boolean} value */
    set isCharging(value) {
        this.setStreamSyncedMeta("battery:isCharging", value);
    }

    /** @return {boolean} */
    get isFull() {
        return this.charge === this.capacity;
    }

    get chargePercentage() {
        return this.charge / this.capacity;
    }

    get valid() {
        return this.hasStreamSyncedMeta("battery:capacity");
    }

    createBattery(capacity, charge = capacity) {
        this.capacity = capacity;
        this.charge = charge;
        // this.health = 100;
        this.isCharging = false;
        // Battery.all.add(this);
    }

    // /**
    //  * @param {alt.Vehicle} entity
    //  * @param {number} capacity
    //  * @param {number} charge
    //  */
    // constructor(entity, capacity, charge = capacity) {
    //     if (!entity) throw new Error("Entity is not valid.");
    //     this.capacity = capacity;
    //     this.charge = charge;
    //     // this.#health = 100;
    //     this.#chargeInterval = null;
    //     Battery.all.add(this);
    // }

    fullCharge() {
        this.charge = this.capacity;
    }

    /**
     * Add charge to the battery.
     * @param {number} gain - Amount to add to the charge.
     * @param {number}  interval - Time in milliseconds to add the charge.
     */
    startCharge(gain, interval) {
        if (this.isCharging) {
            alt.logWarning("Battery is already charging.");
            return;
        }
        this.isCharging = true;
        this.#chargeInterval = alt.setInterval(() => {
            if (this.charge < this.capacity) {
                this.charge += gain;
                if (this.charge > this.capacity) {
                    this.fullCharge();
                }
            }
        }, interval);
    }

    stopCharge() {
        if (!this.isCharging) {
            alt.logWarning("Battery is not charging.");
            return;
        }
        this.isCharging = false;
        if (this.#chargeInterval) {
            alt.clearInterval(this.#chargeInterval);
            this.#chargeInterval = null;
        }
    }

    deleteMetaData() {
        this.deleteMeta("battery:charge");
        this.deleteStreamSyncedMeta("battery:capacity");
        this.deleteStreamSyncedMeta("battery:charge");
        this.deleteStreamSyncedMeta("battery:health");
        this.deleteStreamSyncedMeta("battery:isCharging");
    }

    swapEntity(entity) {
        entity.setStreamSyncedMeta("battery:capacity", this.capacity);
        entity.setStreamSyncedMeta("battery:charge", this.charge);
        entity.setStreamSyncedMeta("battery:health", this.health);
        entity.setStreamSyncedMeta("battery:isCharging", this.isCharging);
        this.deleteMetaData();
    }

    destroy() {
        if (this.isCharging) this.stopCharge();
        this.deleteMetaData();
        Battery.all.delete(this);
    }
}
