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

alt.onClient("sendDataToServer", (player, { mods, wheels, colors, neons, plate }) => {
    const veh = player.vehicle;
    veh.setAllMods(mods);
    veh.setAllWheels(wheels);
    veh.setAllColors(colors);
    //  veh.setAllExtraColors(data.extraColors);
    veh.setAllNeons(neons);
    veh.setPlate(plate);
    veh.saveAppearance();
});

alt.onClient("vehicle:repair", (player, vehicle) => {
    const veh = vehicle ? vehicle : player.vehicle;
    if (!veh) return;
    veh.repair();
    // player.notif(vehicle, "~g~Comme neuve");
});

alt.onClient("vehicle:despawn", (player, vehicle) => {
    const veh = vehicle || player.vehicle;
    if (!veh) return;
    veh.save();
    veh.destroy();
    // player.notif(vehicle, "~g~Disparition");
});
alt.onClient("vehicle:register", (player, vehicle) => {
    const veh = vehicle || player.vehicle;
    if (!veh) return;
    veh.register(player)
        .then((id) => player.notif(veh, `~g~Enregistré avec succès\navec l'id [${id}]`))
        .catch((id) => {
            if (id === -1) player.notif(veh, "~r~Erreur lors de l'enregistrement\nVeuillez réessayer");
            else player.notif(veh, `~r~Déjà enregistré\n ID [${id}]res`);
        });
});

alt.onClient("vehicle:delete", (player, vehicle) => {
    const veh = vehicle || player.vehicle;
    if (!veh || !veh.hasSyncedMeta("id")) return;
    const id = veh.getSyncedMeta("id");
    veh.delete()
        .then((res) => player.notif(veh, `~g~[${id}] Supprimé avec succès`))
        .catch((res) => player.notif(veh, "~r~Erreur lors de la suppression\nVeuillez réessayer"));
});

alt.Player.prototype.notif = function (vehicle, message) {
    const modelName = vehicle.getNameByHash().capitalizeFirstLetter();
    alt.emitClient(this, "notificationRaw", "CHAR_CARSITE", "Garage", modelName, message);
};

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
