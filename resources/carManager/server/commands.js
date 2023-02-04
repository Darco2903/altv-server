import * as alt from "alt-server";
import * as chat from "chat";
import * as db from "database";

chat.registerCmd("t", (player) => {
    console.table(alt.Vehicle.all);
});

chat.registerCmd("savetest", (player) => {
    player.vehicle.register(player);
});

chat.registerCmd("clearveh", (player) => {
    alt.Vehicle.all.forEach((veh) => veh.destroy());
    chat.send(player, "cleared");
});

chat.registerCmd("repair", (player) => {
    if (player.vehicle) player.vehicle.repair();
    else {
        alt.emitClient(player, "vehicle:nearest");
        //  alt.onClient("vehicle:nearest", (player, veh) => {
        //      console.log("repaired", i);
        //      i++
        //      veh.repair()
        //  })
    }
});

chat.registerCmd("vehspawn", (player, [model]) => {
    if (!model) return;
    const hash = alt.hash(model);
    alt.emit("createVehicle", player, hash);
});

chat.registerCmd("appearance", (player, [hash]) => {
    if (!player.vehicle) return;
    player.vehicle.setAppearanceDataBase64(hash);
});

chat.registerCmd("drift", (player, [state]) => {
    if (!player.vehicle || state || !["true", "false"].includes(state)) return;
    player.vehicle.driftModeEnabled = state == "true";
});
