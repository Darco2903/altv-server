import * as alt from "alt-server";
import { hunters, survivors, spectators } from "../team/index.js";

const SURVIVOR_HEALTH = 9999;
const SURVIVOR_WEAPON = "WEAPON_RAYPISTOL";

/**
 * @param {alt.Player} player
 */
function createSurvivorPack(player) {
    const pos = new alt.Vector3(825.07, -3061.98, 5.57);
    player.pos = pos;
    player.maxHealth = SURVIVOR_HEALTH;
    player.health = SURVIVOR_HEALTH;
    player.removeAllWeapons();
    player.giveWeapon(SURVIVOR_WEAPON, 0, true);
}

alt.onClient("upn:survivor:explode", (player) => {
    alt.emitAllClients("upn:survivor:explode", player);
});

function clean() {
    survivors.players.forEach((player) => {
        player.removeWeapon(SURVIVOR_WEAPON);
        player.maxHealth = 100;
        player.health = 100;
    });
}

alt.on("upn:stop", clean);

export { createSurvivorPack };
