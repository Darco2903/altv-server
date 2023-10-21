import * as alt from "alt-server";

alt.onClient("vehicle:signals", (player, vehicle, side) => {
    vehicle.setStreamSyncedMeta("signals", side);
});

alt.onClient("vehicle:signals:reset", (player, vehicle) => {
    vehicle.deleteStreamSyncedMeta("signals");
});
