import * as alt from "alt-server";

export default class Battery {
    /** @param {alt.Entity} entity */
    static getCapacity(entity) {
        return entity.getStreamSyncedMeta("battery:capacity");
    }

    /**
     * @param {alt.Entity} entity
     * @param {number} value
     */
    static setCapacity(entity, value) {
        entity.setStreamSyncedMeta("battery:capacity", value);
    }

    /** @param {alt.Entity} entity */
    static getCharge(entity) {
        return entity.getStreamSyncedMeta("battery:charge");
    }

    /**
     * @param {alt.Entity} entity
     * @param {number} value
     */
    static setCharge(entity, value) {
        entity.setStreamSyncedMeta("battery:charge", value);
    }

    /** @param {alt.Entity} entity */
    static hasBattery(entity) {
        return entity.hasStreamSyncedMeta("battery:capacity");
    }

    /** @param {alt.Entity} entity */
    static getHealth(entity) {
        return entity.getStreamSyncedMeta("battery:health");
    }

    /**
     * @param {alt.Entity} entity
     * @param {number} value
     */
    static setHealth(entity, value) {
        entity.setStreamSyncedMeta("battery:health", value);
    }

    /** @param {alt.Entity} entity */
    static getIsCharging(entity) {
        return entity.getStreamSyncedMeta("battery:isCharging");
    }

    /**
     * @param {alt.Entity} entity
     * @param {boolean} value
     */
    static setIsCharging(entity, value) {
        entity.setStreamSyncedMeta("battery:isCharging", value);
    }

    /** @param {alt.Entity} entity */
    static getIsFull(entity) {
        return Battery.getCapacity(entity) === Battery.getCharge(entity);
    }

    /** @param {alt.Entity} entity */
    static getChargePercentage(entity) {
        return (Battery.getCharge(entity) / Battery.getCapacity(entity)) * 100;
    }

    /** @param {alt.Entity} entity */
    static getIsValid(entity) {
        return entity.hasStreamSyncedMeta("battery:capacity");
    }

    /** @param {alt.Entity} entity */
    static fullCharge(entity) {
        Battery.setCharge(entity, Battery.getCapacity(entity));
    }

    /**
     * @param {alt.Entity} entity
     * @param {number} capacity
     * @param {number} charge
     * @param {number} health
     */
    static create(entity, capacity, charge, health) {
        Battery.setCapacity(entity, capacity);
        Battery.setCharge(entity, charge);
        Battery.setHealth(entity, health);
        Battery.setIsCharging(entity, false);
    }

    /** @param {alt.Entity} entity */
    static remove(entity) {
        entity.deleteStreamSyncedMeta("battery:capacity");
        entity.deleteStreamSyncedMeta("battery:charge");
        entity.deleteStreamSyncedMeta("battery:health");
        entity.deleteStreamSyncedMeta("battery:isCharging");
        // if (entity instanceof alt.Vehicle) {
        //     /** @type {alt.Vehicle} */
        //     const veh = entity;
        //     veh.engineOn = true;
        //     veh.engineOn = false;
        // }
    }

    /**
     * @param {alt.Entity} oldEntity
     * @param {alt.Entity} newEntity
     */
    static swapEntity(oldEntity, newEntity) {
        Battery.create(newEntity, Battery.getCapacity(oldEntity), Battery.getCharge(oldEntity), Battery.getHealth(oldEntity));
        Battery.remove(oldEntity);
    }
}
