import * as alt from "alt-server";
import * as db from "database";

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
    return newVeh;
}

alt.on("importVehicle", importPlayerVehicle);
alt.onClient("vehicle:import", importPlayerVehicle);

function importPlayerVehicle(player, id) {
    getVehicleDataById(id)
        .then((data) => {
            const newVeh = createPlayerVehicle(player, alt.hash(data.model));
            if (!newVeh) {
                alt.emitClient(player, "notificationRaw", "CHAR_BLOCKED", "Erreur", "Spawn véhicule", `~r~Problème lors de la création du véhicule id: ${id}`);
                return;
            }
            newVeh.setSyncedMeta("id", data.id);
            newVeh.setSyncedMeta("owner", data.owner);
            newVeh.setAppearanceDataBase64(data.appearance);
        })
        .catch(() => {
            alt.emitClient(player, "notificationRaw", "CHAR_BLOCKED", "Erreur", "Véhicule import", `~r~Problème de récupération du véhicule id: ${id} dans la base de donnée`);
        });
}

function getVehicleDataById(id) {
    return new Promise((resolve, reject) => {
        db.fetchByIds(id, "Vehicle", ([res]) => {
            if (!res || !res.model) {
                reject();
                return;
            }
            resolve(res);
        });
    });
}

alt.onClient("vehicle:replace", async (player, hash) => {
    const newVeh = createVehicle(hash, player.vehicle.pos, player.vehicle.rot);
    if (!newVeh) return;
    const oldVeh = player.vehicle;
    newVeh.engineOn = oldVeh.engineOn;
    alt.emitClient(player, "replacePlayerVehicle", newVeh);
    await alt.Utils.waitFor(() => newVeh.driver, 1000)
        .then(() => oldVeh.destroy())
        .catch(() => {});
});

alt.onClient("vehicle:importReplace", (player, id) => {
    getVehicleDataById(id)
        .then(async (data) => {
            const newVeh = createVehicle(alt.hash(data.model), player.pos, player.rot);
            if (!newVeh) {
                alt.emitClient(player, "notificationRaw", "CHAR_BLOCKED", "Erreur", "Spawn véhicule", `~r~Problème lors de la création du véhicule id: ${id}`);
                return;
            }
            newVeh.setSyncedMeta("id", data.id);
            newVeh.setSyncedMeta("owner", data.owner);
            newVeh.setAppearanceDataBase64(data.appearance);
            const oldVeh = player.vehicle;
            newVeh.engineOn = oldVeh.engineOn;
            alt.emitClient(player, "replacePlayerVehicle", newVeh);
            await alt.Utils.waitFor(() => newVeh.driver, 1000)
                .then(() => oldVeh.destroy())
                .catch(() => {});
        })
        .catch(() => {
            alt.emitClient(player, "notificationRaw", "CHAR_BLOCKED", "Erreur", "Véhicule import", `~r~Problème de récupération du véhicule id: ${id} dans la base de donnée`);
        });
});

alt.onClient("getPlayerVehicles", (player) => {
    db.fetchAllByField("owner", player.getSyncedMeta("id"), "Vehicle", (res) => {
        if (res.length > 0) {
            const data = res.map(({ id, model }) => ({ id, model }));
            alt.emitClient(player, "playerGarage", data);
        }
    });
});

alt.onClient("sendDataToServer", (player, { mods, wheels, colors, neons, plate }) => {
    const veh = player.vehicle;
    veh.setAllMods(mods);
    veh.setAllWheels(wheels);
    veh.setAllColors(colors);
    //  veh.setAllExtraColors(data.extraColors);
    veh.setAllNeons(neons);
    veh.setPlate(plate);
    if (!veh.hasSyncedMeta("id")) return;
    veh.saveAppearance()
        .then(() => player.notif(veh, `~g~Modifications sauvegardées`))
        .catch(() => alt.emitClient(player, "notificationRaw", "CHAR_BLOCKED", "Erreur", "Sauvegarde", `~r~Problème lors de la sauvegarde des modifications`));
});

function repairVehicle(player, vehicle) {
    const veh = vehicle || player.vehicle;
    if (!veh) return;
    veh.repair();
    player.notif(veh, "~g~Réparé");
}

alt.on("vehicle:repair", repairVehicle);
alt.onClient("vehicle:repair", repairVehicle);

alt.onClient("vehicle:despawn", (player, vehicle) => {
    const veh = vehicle || player.vehicle;
    if (!veh) return;
    alt.setTimeout(() => veh.destroy(), 100);
});

alt.onClient("vehicle:register", (player, vehicle) => {
    const veh = vehicle || player.vehicle;
    if (!veh) return;
    if (veh.hasSyncedMeta("id")) player.notif(veh, `~r~Déjà enregistré\n ID [${veh.getSyncedMeta("id")}]res`);
    veh.register(player)
        .then((id) => player.notif(veh, `~g~Enregistré avec succès\navec l'id [${id}]`))
        .catch(() => player.notif(veh, "~r~Erreur lors de l'enregistrement\nVeuillez réessayer"));
});

alt.onClient("vehicle:delete", (player, vehicle) => {
    const veh = vehicle || player.vehicle;
    if (!veh || !veh.hasSyncedMeta("id")) return;
    const id = veh.getSyncedMeta("id");
    veh.delete()
        .then(() => player.notif(veh, `~g~[${id}] Supprimé avec succès`))
        .catch(() => player.notif(veh, "~r~Erreur lors de la suppression\nVeuillez réessayer"));
});
