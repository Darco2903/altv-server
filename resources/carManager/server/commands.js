import * as alt from "alt-server";
import * as chat from "chat";
import * as db from "database";

chat.registerCmd("t", (player) => {
    console.table(alt.Vehicle.all);
});

chat.registerCmd("saveTest", (player) => {
    player.vehicle.register(player);
});

chat.registerCmd("clearVeh", (player) => {
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

chat.registerCmd("vehspawn", (player, [vehName]) => {
    if (!vehName) return;
    try {
        const pos = player.pos.toFixed(2);
        let veh = new alt.Vehicle(vehName, pos.add(2, 0, 0), new alt.Vector3(0, 0, 0));
        veh.init(vehName);
        if (!newVeh) return;
        player.setIntoVehicle(newVeh, 1);
    } catch (error) {}
});

chat.registerCmd("appearance", (player, [hash]) => {
    if (!player.vehicle) return;
    player.vehicle.setAppearanceDataBase64(hash);
});
