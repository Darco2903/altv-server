import * as alt from "alt-server";
import { hunters, survivors, spectators } from "./team/index.js";
import { createHunterCar } from "./player/hunter.js";
import { createSurvivorPack } from "./player/survivor.js";

const GAME_TIME = 60_000;

alt.onClient("upn:game:start", async () => {
    if (alt.getMeta("upn:game:started")) return;
    if (!hunters.ready || !survivors.ready) {
        alt.log("Not all players are ready.");
        return;
    }

    alt.log("Initializing game...");
    alt.emitAllClients("upn:game:init");
    await alt.Utils.wait(1000);
    alt.emit("upn:cleanup");

    scoreBoard = hunters.players.concat(survivors.players);

    hunters.players.forEach((player) => {
        player.setStreamSyncedMeta("upn:team", "hunters");
        player.setStreamSyncedMeta("spectator", false);
        createHunterCar(player);
    });
    survivors.players.forEach((player) => {
        player.setStreamSyncedMeta("upn:team", "survivors");
        player.setStreamSyncedMeta("spectator", false);
        createSurvivorPack(player);
    });
    spectators.players.forEach((player) => {
        player.setStreamSyncedMeta("upn:team", "spectators");
        player.setStreamSyncedMeta("spectator", true);
    });

    alt.setMeta("upn:game:starting", true);
    await alt.Utils.wait(1000);
    alt.emitAllClients("upn:game:ready");

    await alt.Utils.wait(2000);
    alt.emitAllClients("upn:countdown:start");

    await alt.Utils.wait(3000);
    alt.emitAllClients("upn:game:start");
    alt.setMeta("upn:game:init", false);
    alt.setMeta("upn:game:starting", false);
    alt.setMeta("upn:game:started", true);
});

/** @type {Map<alt.Player, {score: number, spec: boolean}>} */
let scoreBoard = new Map();

alt.on("playerDamage", (victim, attacker, healthDamage, armourDamage, weaponHash) => {
    if (!alt.getMeta("upn:game:started")) return;
    // if (hunters.players.includes(attacker) && survivors.players.includes(victim)) {
    //     console.log(victim.name, attacker.name, healthDamage, armourDamage);
    // }
    if (victim === attacker) return;
    // if (!scoreBoard.has(victim)) return;
    // if (!scoreBoard.has(attacker)) return;
    if (attacker.team !== hunters) return;

    const data = scoreBoard.get(attacker);
    data.score += healthDamage;
    scoreBoard.set(attacker, data);
});

alt.on("playerDeath", (victim, killer, weaponHash) => {
    if (!alt.getMeta("upn:game:started")) return;
    // if (survivors.players.includes(victim)) {
    // }
    // if (victim.team !== survivors) return;
    if (!scoreBoard.has(victim)) return;
    console.log(victim.name, killer.name, weaponHash);
    victim.setStreamSyncedMeta("spectator", true);
});

alt.on("playerConnect", (player) => {
    if (!alt.getMeta("upn:game:started")) return;
    player.setStreamSyncedMeta("spectator", true);
});

alt.on("playerSpawn", (player) => {
    console.log("playerSpawn", player.name);
    if (!alt.getMeta("upn:game:started")) return;
    player.setStreamSyncedMeta("spectator", true);
});
