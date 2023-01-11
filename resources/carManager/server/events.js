import * as alt from "alt-server";

alt.on("save", () => {
    alt.Vehicle.all.forEach((veh) => veh.save());
    alt.emit("saveLog", "All vehicles saved");
});

function createVehicle(hash, pos, rot) {
    try {
        const veh = new alt.Vehicle(parseInt(hash), pos, rot);
        veh.init();
        return veh;
    } catch (error) {
        alt.logError(`Vehicle hash: ${hash} not exist`);
    }
}

alt.on("createVehicle", createPlayerVehicle);
alt.onClient("vehicle:create", createPlayerVehicle);

function createPlayerVehicle(player, hash) {
    const newVeh = createVehicle(hash, player.pos, player.rot);
    if (!newVeh) return;
    player.setIntoVehicle(newVeh, 1);
}

alt.onClient("vehicle:replace", async (player, hash) => {
    const newVeh = createVehicle(hash, player.vehicle.pos, player.vehicle.rot);
    if (!newVeh) return;
    const oldVeh = player.vehicle;
    newVeh.engineOn = oldVeh.engineOn;
    alt.emitClient(player, "replacePlayerVehicle", newVeh);
    await alt.Utils.waitFor(() => newVeh.driver, 1000).then(() => oldVeh.destroy());
});

alt.onClient("sendDataToServer", (player, data) => {
    const veh = player.vehicle;
    veh.setAllMods(data.mods);
    veh.setAllWheels(data.wheels);
    veh.setAllColors(data.colors);
    veh.setAllExtraColors(data.extraColors);
    veh.setAllNeons(data.neons);
    veh.setPlate(data.plate);
    veh.saveAppearance();
});

alt.onClient("vehicle:repair", (player, vehicle) => {
    vehicle.repair();
});
