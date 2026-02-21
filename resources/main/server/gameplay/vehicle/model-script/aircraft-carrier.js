import * as alt from "alt-server";

const STREAMING_DISTANCE = 4000;

const carriergta5 = alt.hash("carriergta5");

alt.on("vehicle:spawned", (vehicle) => {
    if (vehicle.model !== carriergta5) return;
    vehicle.streamingDistance = STREAMING_DISTANCE;
});
