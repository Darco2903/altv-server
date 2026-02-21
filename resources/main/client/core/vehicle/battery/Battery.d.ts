export default class Battery {
    public readonly batteryCapacity: number;
    public batteryCharge: number;
    public syncBatteryCharge(): void;
    public readonly batteryHealth: number;
    public readonly hasBattery: boolean;
    public readonly batteryPercentage: number;
    public readonly isBatteryFull: boolean;
    public setBatteryFull(): void;
}
