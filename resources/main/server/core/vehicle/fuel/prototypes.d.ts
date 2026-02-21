import * as alt from "alt-server";

declare module "alt-server" {
    declare interface Vehicle {
        fuel: number;
        fuelCapacity: number;
        fuelConsumption: number;
    }
}
