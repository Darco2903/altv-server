import * as alt from "alt-server";
import { db, tables } from "./database/index.js";

const DEFAULT_MODEL = alt.hash("MP_M_Freemode_01");
const DEFAULT_POS = [180, -1030, 28];

alt.on("playerConnect", (player) => {
    // const accept = db.isConnected();
    const accept = true;
    if (accept) {
        alt.log(`${player.socialID} (${player.name}) from ${player.ip} connecting...`);
    } else {
        alt.log(`Refused connection of ${player.socialID} (${player.name}) from ${player.ip}`);
    }
    return accept;
});

alt.on("playerConnect", connectPlayer);
alt.on("playerDisconnect", (player, reason) => {
    alt.log(`${player.name} disconnected. Reason: ${reason}`);
    disconnectPlayer(player);
});

alt.on("resourceStart", () => {
    alt.Player.all.forEach(connectPlayer);
});
/**
 * @description register a new player
 * @param {alt.Player} player player to register
 * @returns {Promise<Number>} id of the new account
 */
async function registerPlayer(player) {
    const data = { name: player.name, rsid: player.socialID, op: 0 };
    data.id = db.insertData(data, tables.account);
    db.insertData({ id: data.id }, tables.character);
    alt.log(`[${data.id}]|${player.name} succesfully registered!`);
    return Promise.resolve(data);
}

/**
 * @description use player rsid to get account id
 * @param {alt.Player} player
 * @returns {Promise<void>}
 */
async function authPlayer(player) {
    let data;
    try {
        let acc = await db.selectByValue("rsid", player.socialID, tables.account);
        acc = acc[0] ?? (await registerPlayer(player));
        player.setSyncedMeta("id", acc.id);
        player.setSyncedMeta("op", acc.op);
        data = await db.fetchById(acc.id, tables.character);
    } catch (error) {
        alt.logError(error);
    }
    return Promise.resolve(data);
}

/**
 * @param {alt.Player} player
 */
async function connectPlayer(player) {
    // order is important
    if (player.getSyncedMeta("id") || player.isSpawned) {
        return;
    }
    const data = await authPlayer(player);

    let model;
    if (!data?.model) {
        model = DEFAULT_MODEL;
    } else {
        model = alt.getPedModelInfoByHash(alt.hash(data.model)).hash || DEFAULT_MODEL;
    }
    player.model = model;
    player.spawn(new alt.Vector3(data?.pos.map((x) => +x) ?? DEFAULT_POS));
    player.visible = true;
    player.health = 200;
    player.armour = 0;
    alt.log(`[${player.getSyncedMeta("id")}]|${player.name} succesfully connected!`);
}

/**
 * @param {alt.Player} player
 * @returns {Promise<void>}
 */
async function disconnectPlayer(player) {
    if (!player.hasSyncedMeta("id")) {
        return;
    }

    try {
        await db.updateDataByIds(
            player.getSyncedMeta("id"),
            {
                pos: player.pos.toFixed(2).toArray(),
            },
            tables.character
        );
    } catch (error) {
        alt.logError(error);
    }
}

alt.onClient("player:giveWeapon", (player, hash, amount, equipNow) => {
    player.giveWeapon(parseInt(hash), parseInt(amount), equipNow);
});
alt.onClient("player:removeWeapons", (player) => player.removeAllWeapons());

alt.onClient("player:setModel", (player, hash) => {
    // const veh = player.vehicle;
    player.model = parseInt(hash);
    // if (veh) player.setIntoVehicle(veh, )
});

alt.onClient("player:saveModel", async (player) => {
    try {
        if (!player.hasSyncedMeta("id")) {
            throw new Error(`(player:saveModel) ${player.name} has no id`);
        }
        const id = player.getSyncedMeta("id");
        const model = alt.getPedModelInfoByHash(player.model).name;
        if (!model) {
            return;
        }
        const updated = await db.updateDataByIds(id, { model }, tables.character);
        if (updated === 1) {
            player.notify({
                imageName: "CHAR_DEFAULT",
                headerMsg: "Modèle sauvegardé",
            });
        } else {
            throw new Error(`(player:saveModel) model save err ${player.name}`);
        }
    } catch (error) {
        alt.logError(error);
        player.notify({
            imageName: "CHAR_BLOCKED",
            headerMsg: "Erreur",
            detailsMsg: "Model",
            message: "Problème lors de la sauvegarde",
        });
    }
});
