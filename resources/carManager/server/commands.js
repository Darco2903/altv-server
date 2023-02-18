import * as alt from "alt-server";
import * as chat from "chat";
import * as db from "database";

chat.registerCmd("listveh", () => {
    console.table(alt.Vehicle.all);
});

// chat.registerCmd("savetest", (player) => {
//     player.vehicle.register(player);
// });

chat.registerCmd("vehspawn", (player, [model]) => {
    if (!model) return;
    const hash = alt.hash(model);
    alt.emit("createVehicle", player, hash);
});

chat.registerCmd("clearveh", (player) => {
    alt.Vehicle.all.forEach((veh) => veh.destroy());
    chat.send(player, "cleared");
});

chat.registerCmd("repair", async (player) => {
    let vehicle = player.vehicle || (await player.getNearestVehicle());
    if (vehicle && vehicle.valid) alt.emit("vehicle:repair", player, vehicle);
    else alt.emitClient(player, "notificationRaw", "CHAR_BLOCKED", "Erreur", "Réparer", "~r~Aucun véhicule trouvé");
});

chat.registerCmd("setappearance", (player, [hash]) => {
    if (!player.vehicle) return;
    player.vehicle.setAppearanceDataBase64(hash);
});

chat.registerCmd("getappearance", (player, [hash]) => {
    if (!player.vehicle) return;
    console.log(player.vehicle.getAppearanceDataBase64(hash));
});

chat.registerCmd("drift", (player, [state]) => {
    if (!player.vehicle || state || !["true", "false"].includes(state)) return;
    player.vehicle.driftModeEnabled = state == "true";
});
