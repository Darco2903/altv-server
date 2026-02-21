import * as alt from "alt-server";

export default class Battery {
    static getCapacity(entity: alt.Entity): number;
    static setCapacity(entity: alt.Entity, capacity: number): void;
    static getCharge(entity: alt.Entity): number;
    static setCharge(entity: alt.Entity, charge: number): void;
    static hasBattery(entity: alt.Entity): boolean;
    static getHealth(entity: alt.Entity): number;
    static setHealth(entity: alt.Entity, health: number): void;
    static getIsCharging(entity: alt.Entity): boolean;
    static setIsCharging(entity: alt.Entity, isCharging: boolean): void;
    static getIsFull(entity: alt.Entity): boolean;
    static fullCharge(entity: alt.Entity): void;
    static getChargePercentage(entity: alt.Entity): number;
    static getIsValid(entity: alt.Entity): boolean;
    static create(entity: alt.Entity, capacity: number, charge: number, health: number): void;
    static remove(entity: alt.Entity): void;
    static swapEntity(oldEntity: alt.Entity, newEntity: alt.Entity): void;
}
