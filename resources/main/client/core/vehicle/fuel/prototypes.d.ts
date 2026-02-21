import * as alt from "alt-client";

declare module "alt-client" {
    declare interface Vehicle {
        fuel: number;
        readonly fuelCapacity: number;
        readonly fuelConsumption: number;
    }
}
