import * as alt from "alt-client";

declare module "alt-client" {
    declare interface Vehicle {
        public getTyreWear(index: number): number;
        public setTyreWear(index: number, wear: number): void;
        public getTyreWearRate(index: number): number;
        public setTyreWearRate(index: number, rate: number): void;
        public getTyreWearRateScale(index: number): number;
        public setTyreWearRateScale(index: number, scale: number): void;
        public getTyrePressure(index: number): number;
        public setTyrePressure(index: number, pressure: number): void;
        public getTyreTemperature(index: number): number;
        public setTyreTemperature(index: number, temperature: number): void;
    }
}
