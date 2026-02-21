import * as alt from "alt-server";

Object.defineProperty(alt.Vehicle.prototype, "fuel", {
    get() {
        return this.getStreamSyncedMeta("fuel:level");
    },
    set(value) {
        this.setStreamSyncedMeta("fuel:level", value);
    },
});

Object.defineProperty(alt.Vehicle.prototype, "fuelCapacity", {
    get() {
        return this.getStreamSyncedMeta("fuel:capacity");
    },
    set(value) {
        this.setStreamSyncedMeta("fuel:capacity", value);
    },
});

Object.defineProperty(alt.Vehicle.prototype, "fuelConsumption", {
    get() {
        return this.getStreamSyncedMeta("fuel:consumption");
    },
    set(value) {
        this.setStreamSyncedMeta("fuel:consumption", value);
    },
});
