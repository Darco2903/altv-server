import * as alt from "alt-server";
import { db, tables } from "../database/index.js";

const DEFAULT_MODEL = alt.hash("mp_m_freemode_01");
const DEFAULT_POS = [180, -1030, 28];

alt.on("beforePlayerConnect", (player) => {
    return db.isConnected();
});

alt.on("playerConnect", connect);

alt.on("playerDisconnect", (player, reason) => {});

/**
 * @description register a new player
 * @param {alt.Player} player player to register
 * @returns {Promise<Number>} id of the new account
 */
async function register(player) {
    const id = db.insertData({ name: player.name, rsid: player.socialID }, tables.account);
    db.insertData({ id }, tables.character);
    alt.log(`[${id}]|${player.name} succesfully registered!`);
    return Promise.resolve(id);
}

/**
 * @description use player rsid to get account id
 * @param {alt.Player} player
 * @returns {Promise<void>}
 */
async function auth(player) {
    let data;
    try {
        const acc = await db.selectByValue("rsid", player.socialID, tables.account);
        let id = acc[0]?.id ?? (await register(player));
        data = await db.fetchById(id, tables.character);
    } catch (error) {
        alt.logError(error);
    }
    return Promise.resolve(data);
}

async function connect(player) {
    const data = await auth(player);
    if (!data?.id) {
        player.setSyncedMeta("id", data.id);
    }
    player.model = data?.model ?? DEFAULT_MODEL;
    player.spawn(new alt.Vector3(data?.pos ?? DEFAULT_POS));
    player.visible = true;
    player.health = 200;
}
