import * as alt from "alt-server";

const s1000rr = alt.hash("s1000rr");

alt.on("playerEnteredVehicle", (player, vehicle, seat) => {
    if (vehicle.model !== s1000rr || seat !== 1) return;
    vehicle.setMod(3, 0);
});

alt.on("playerLeftVehicle", (player, vehicle, seat) => {
    if (vehicle.model !== s1000rr || seat !== 1) return;
    vehicle.setMod(3, 1);
});

alt.on("vehicle:spawned", (vehicle) => {
    console.log("vehicle:spawned");
    if (vehicle.model !== s1000rr) return;
    vehicle.setMod(3, +!vehicle.driver);
});
