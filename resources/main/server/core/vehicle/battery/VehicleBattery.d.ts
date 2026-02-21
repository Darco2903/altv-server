import * as alt from "alt-server";
import Battery from "./Battery";

export default abstract class VehicleBattery extends Battery {
    static getPropModel(entity: alt.Entity): string;
    static setPropModel(entity: alt.Entity, value: string): void;
    static createProp(model: string, pos: alt.Vector3, rot?: alt.Vector3): alt.Object;
    static createInVehicle(vehicle: alt.Vehicle, propModel: string, capacity: number, charge: number): void;
    static createInProp(propModel: string, pos: alt.Vector3, rot?: alt.Vector3, capacity: number, charge: number): alt.Object;
    static toProp(vehicle: alt.Vehicle, pos: alt.Vector3, rot?: alt.Vector3): alt.Object;
    static toVehicle(prop: alt.Object, vehicle: alt.Vehicle): void;
    static swapEntity(oldEntity: alt.Entity, newEntity: alt.Entity): void;
}
