import * as alt from "alt-client";

Object.defineProperty(alt.Vehicle.prototype, "fuel", {
    get() {
        // return this.getStreamSyncedMeta("fuel:level");
        return this.getMeta("fuel:level");
    },
    set(value) {
        // alt.emitServer("vehicle:fuel:setLevel", this, value);
        this.setMeta("fuel:level", value);
    },
});

Object.defineProperty(alt.Vehicle.prototype, "fuelCapacity", {
    get() {
        return this.getStreamSyncedMeta("fuel:capacity");
    },
});
// maximum fuel consumption in liters per km (at 100% throttle)
Object.defineProperty(alt.Vehicle.prototype, "fuelConsumption", {
    get() {
        return this.getStreamSyncedMeta("fuel:consumption");
    },
});

alt.Vehicle.prototype.syncFuel = function () {
    alt.emitServer("vehicle:fuel:sync", this, this.fuel);
};

alt.on("streamSyncedMetaChange", (entity, key, value) => {
    if (key === "fuel:level") {
        // console.log("sync fuel level", value);
        entity.fuel = value;
    }
});
