import * as alt from "alt-server";
import { db, tables } from "./database/index.js";

/**
 * @param {Number} hash - Vehicle hash
 * @param {alt.Vector3} pos - Vehicle position
 * @param {alt.Vector3} rot - Vehicle rotation
 * @returns {alt.Vehicle} - New vehicle
 */
export function create(hash, pos, rot) {
    const veh = new alt.Vehicle(hash, pos, rot);
    veh.manualEngineControl = true;
    veh.modKit = +(veh.modKitsCount > 0);
    return veh;
}

alt.onClient("vehicle:create", (player, hash, pos, rot) => {
    try {
        create(hash, pos, rot);
    } catch (error) {
        alt.logError(`Failed to create vehicle: ${error}`);
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Erreur",
            detailMsg: "Véhicule création",
            message: `Modèle inconnu: ${hash}`,
        });
    }
});

/**
 * @param {Number} hash - Vehicle hash
 * @param {alt.Player[]} players - Players to put in the vehicle (driver = players[0])
 * @returns {alt.Vehicle} - New vehicle
 */
export function createPlayersIn(hash, players) {
    const driver = players[0];
    const newVeh = create(hash, driver.pos, driver.rot);
    players.forEach((player, index) => {
        player.setIntoVehicle(newVeh, index + 1);
    });
    return newVeh;
}

alt.onClient("vehicle:createPlayersIn", (player, hash, players) => {
    try {
        createPlayersIn(hash, players);
    } catch (error) {
        alt.logError(`Failed to create vehicle: ${error}`);
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Erreur",
            detailMsg: "Véhicule création",
            message: `Modèle inconnu: ${hash}`,
        });
    }
});

/**
 * @param {alt.Vehicle} vehicle - Vehicle to replace
 * @param {Number} hash - Replacement vehicle hash
 * @returns {Promise<alt.Vehicle>} - New vehicle
 */
async function replace(vehicle, hash) {
    const newVeh = create(hash, vehicle.pos, vehicle.rot);
    newVeh.engineOn = vehicle.engineOn;
    const players = alt.getEntitiesInRange(vehicle.pos, 100, vehicle.dimension, 1);
    alt.emitClient(players, "vehicle:replace", vehicle, newVeh);
    await alt.Utils.wait(2000);
    if (alt.Player.all.filter((player) => player.vehicle === vehicle).length === 0) {
        vehicle.destroy();
    }
    return Promise.resolve(newVeh);
}

alt.onClient("vehicle:replace", async (player, vehicle, hash) => {
    try {
        await replace(vehicle, hash);
    } catch (error) {
        alt.logError(`Failed to replace vehicle: ${error}`);
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Erreur",
            detailMsg: "Véhicule création",
            message: `Modèle inconnu: ${hash}`,
        });
    }
});

/**
 * @param {Number} id - Vehicle db id
 * @param {alt.Vector3} pos - Vehicle position
 * @param {alt.Vector3} rot - Vehicle rotation
 * @returns {Promise<alt.Vehicle>} - New vehicle
 */
export async function importSaved(id, pos, rot) {
    const data = await db.fetchById(id, tables.vehicle);
    const newVeh = create(data.model, pos, rot);
    newVeh.setSyncedMeta("id", data.id);
    newVeh.setMeta("owner", data.owner);
    newVeh.setAppearanceDataBase64(data.appearance);
    return Promise.resolve(newVeh);
}

alt.onClient("vehicle:importSaved", async (player, id, pos, rot) => {
    try {
        await importSavedPlayersIn(id, pos, rot);
    } catch (error) {
        alt.logError(`Failed to import vehicle: ${error}`);
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Erreur",
            detailMsg: "Véhicule import",
            message: `~r~Problème de récupération du véhicule id: ${id}`,
        });
    }
});

/**
 * @param {Number} id - Vehicle db id
 * @param {alt.Player[]} players - Players to put in the vehicle (driver = players[0])
 * @returns {Promise<alt.Vehicle>} - New vehicle
 */
async function importSavedPlayersIn(id, players) {
    try {
        const data = await db.fetchById(id, tables.vehicle);
        const newVeh = createPlayersIn(data.model, players);
        newVeh.setSyncedMeta("id", data.id);
        newVeh.setMeta("owner", data.owner);
        newVeh.setAppearanceDataBase64(data.appearance);
        return Promise.resolve(newVeh);
    } catch (error) {
        alt.logError(`Failed to import vehicle: ${error}`);

        return Promise.reject(error);
    }
}

alt.onClient("vehicle:importSavedPlayersIn", async (player, id, players) => {
    try {
        await importSavedPlayersIn(id, players);
    } catch (error) {
        alt.logError(`Failed to import vehicle: ${error}`);
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Erreur",
            detailMsg: "Véhicule import",
            message: `~r~Problème de récupération du véhicule id: ${id}`,
        });
    }
});

/**
 * @param {alt.Vehicle} vehicle - Vehicle to replace
 * @param {Number} id - Vehicle db id
 * @returns {Promise<alt.Vehicle>} - New vehicle
 */
export async function importSavedReplace(vehicle, id) {
    const newVeh = await importSaved(id, vehicle.pos, vehicle.rot);
    newVeh.engineOn = vehicle.engineOn;
    const players = alt.getEntitiesInRange(vehicle.pos, 100, vehicle.dimension, 1);
    alt.emitClient(players, "vehicle:replace", vehicle, newVeh);
    await alt.Utils.wait(2000);
    if (alt.Player.all.filter((player) => player.vehicle === vehicle).length === 0) {
        vehicle.destroy();
    }
    return Promise.resolve(newVeh);
}

alt.onClient("vehicle:importSavedReplace", async (player, vehicle, id) => {
    try {
        await importSavedReplace(vehicle, id);
    } catch (error) {
        alt.logError(`Failed to replace saved vehicle: ${error}`);
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Erreur",
            detailMsg: "Véhicule import",
            message: `~r~Problème de récupération du véhicule id: ${id} dans la base de donnée`,
        });
    }
});

alt.onClient("getPlayerVehicles", async (player) => {
    const res = await db.selectByValue("owner", player.getSyncedMeta("id"), tables.vehicle);
    if (res.length > 0) {
        const datas = res.map(({ id, model }) => ({ id, model }));
        alt.emitClient(player, "playerGarage", datas);
    }
});

alt.onClient("sendDataToServer", async (player, { mods, wheels, colors, neons, plate }) => {
    const veh = player.vehicle;
    veh.setModsData(mods);
    veh.setWheelsData(wheels);
    veh.setColorsData(colors);
    //  veh.setAllExtraColors(data.extraColors);
    veh.setNeonsData(neons);
    veh.setPlate(plate);
    if (veh.hasSyncedMeta("id")) {
        try {
            await veh.saveAppearance();
            player.notify({
                imageName: "CHAR_LS_CUSTOMS",
                headerMsg: "Sauvegarde effectuée",
                // detailMsg: veh.model,
                // message: `~g~Modifications sauvegardées`,
            });
        } catch (error) {
            player.notify({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailMsg: "Sauvegarde",
                message: `~r~Problème lors de la sauvegarde des modifications`,
            });
        }
    }
});

alt.onClient("vehicle:repair", (player, vehicle) => {
    vehicle.repair();
    player.notify({
        imageName: "CHAR_CARSITE",
        headerMsg: "Réparation",
        detailMsg: vehicle.model,
        message: `~g~Réparation effectuée`,
    });
});

alt.onClient("vehicle:despawn", (player, vehicle) => {
    const veh = vehicle || player.vehicle;
    if (!veh) return;
    alt.setTimeout(() => veh.destroy(), 100);
});

alt.onClient("vehicle:register", async (player, vehicle) => {
    if (vehicle.hasSyncedMeta("id") && vehicle.getMeta("owner") === player.getSyncedMeta("id")) {
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Attention",
            detailMsg: vehicle.model,
            message: `~r~Ce véhicule est déjà enregistré\n ID: ${vehicle.getSyncedMeta("id")}`,
        });
        return;
    }
    try {
        const id = await vehicle.register();
        player.notify({
            imageName: "CHAR_CARSITE",
            headerMsg: "Enregistrement",
            detailMsg: vehicle.model,
            message: `~g~Véhicule enregistré avec succès\n ID: ${id}`,
        });
    } catch (error) {
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Erreur",
            detailMsg: vehicle.model,
            message: `~r~Problème lors de l'enregistrement du véhicule`,
        });
    }
});

alt.onClient("vehicle:delete", async (player, vehicle) => {
    try {
        const id = await vehicle.delete();
        player.notify({
            imageName: "CHAR_CARSITE",
            headerMsg: "Suppression",
            detailMsg: vehicle.model,
            message: `~g~Véhicule supprimé avec succès\n ID: ${id}`,
        });
    } catch (error) {
        alt.logError(`Failed to delete vehicle: ${error}`);
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Erreur",
            detailMsg: vehicle.model,
            message: `~r~Problème de suppression\n ID: ${vehicle.getSyncedMeta("id")}`,
        });
    }
});
