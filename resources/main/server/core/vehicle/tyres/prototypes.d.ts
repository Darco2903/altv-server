import * as alt from "alt-server";
import Tyre, { TyreData } from "./Tyre";

declare module "alt-server" {
    declare interface Vehicle {
        public getTyre(index: number): TyreData;
        readonly tyres: Map<number, Tyre>;
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
        public hasTyre(index: number): boolean;
        public mountTyre(index: number, tyre: Tyre): void;
        public unMountTyre(index: number, pos?: alt.Vector3): Tyre;
    }
}
