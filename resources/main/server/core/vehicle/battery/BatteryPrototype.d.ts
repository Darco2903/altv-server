import * as alt from "alt-server";

export default class BatteryPrototype {
    public readonly batteryCapacity: number;
    public batteryCharge: number;
    public readonly batteryHealth: number;
    public readonly hasBattery: boolean;
    public readonly batteryPercentage: number;
    public readonly isBatteryFull: boolean;
    public setBatteryFull(): void;
}
