import * as alt from "alt-client";

export default class Battery extends alt.Entity {
    get batteryCapacity() {
        return parseFloat(this.getStreamSyncedMeta("battery:capacity"));
    }

    get batteryCharge() {
        // return parseFloat(this.getStreamSyncedMeta("battery:charge"));
        if (!this.hasMeta("battery:charge")) {
            this.batteryCharge = this.getStreamSyncedMeta("battery:charge");
        }
        return parseFloat(this.getMeta("battery:charge"));
    }

    set batteryCharge(value) {
        this.setMeta("battery:charge", value);
    }

    syncBatteryCharge() {
        alt.emitServer("battery:setCharge", this, this.batteryCharge);
    }

    get batteryHealth() {
        return parseFloat(this.getStreamSyncedMeta("battery:health"));
    }

    get hasBattery() {
        return this.hasStreamSyncedMeta("battery:capacity");
    }

    get batteryPercentage() {
        return (this.batteryCharge / this.batteryCapacity) * 100;
    }

    get isBatteryFull() {
        return this.batteryCharge === this.batteryCapacity;
    }

    setBatteryFull() {
        this.batteryCharge = this.batteryCapacity;
        this.syncBatteryCharge();
    }
}


