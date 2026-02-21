import * as alt from "alt-server";

const AMBIENT_TEMP = 20;

alt.on("vehicle:spawned", (vehicle) => {
    vehicle.setStreamSyncedMeta("engineTemp", AMBIENT_TEMP);
    vehicle.setStreamSyncedMeta("radiatorEfficiency", 1);
});
