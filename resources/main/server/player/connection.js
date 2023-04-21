import * as alt from "alt-server";
import { db, tables } from "../database/index.js";

const DEFAULT_MODEL = alt.hash("mp_m_freemode_01");
const DEFAULT_POS = [180, -1030, 28];

alt.on("beforePlayerConnect", (player) => {
    return db.isConnected();
});

alt.on("playerConnect", connectPlayer);
alt.on("playerDisconnect", (player, reason) => {});

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
        player.setMeta("op", acc.op);
        player.setSyncedMeta("id", acc.id);
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
    player.model = data?.model ?? DEFAULT_MODEL;
    player.spawn(new alt.Vector3(data?.pos ?? DEFAULT_POS));
    player.visible = true;
    player.health = 200;
}
