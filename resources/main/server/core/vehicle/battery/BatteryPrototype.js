import * as alt from "alt-server";
import VehicleBattery from "./VehicleBattery.js";

export default class BatteryPrototype extends alt.Entity {
    get batteryCapacity() {
        return VehicleBattery.getCapacity(this);
    }

    get batteryCharge() {
        return VehicleBattery.getCharge(this);
    }

    set batteryCharge(value) {
        VehicleBattery.setCharge(this, value);
    }

    get batteryHealth() {
        return VehicleBattery.getHealth(this);
    }

    get hasBattery() {
        return VehicleBattery.hasBattery(this);
    }

    get batteryPercentage() {
        return VehicleBattery.getChargePercentage(this);
    }

    get isBatteryFull() {
        return this.batteryCharge === this.batteryCapacity;
    }

    setBatteryFull() {
        this.batteryCharge = this.batteryCapacity;
    }
}
