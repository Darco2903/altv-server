import * as alt from "alt-server";
import NPC from "./npc.js";
import Teams from "./teams.js";
import { initHiders } from "./team/hider.js";
import { initHunters } from "./team/hunter.js";
import { randomModel, randomSpawnPoint } from "./utils.js";

const MAX_NPC = 100;
const NPC_REMOVE_TIME = 120_000; // 2 minutes
const GAME_TIME_LIMIT = 600_000; // 10 minutes

let gameInit = false;
let gameStarted = false;
let gameFullyStarted = false;
let npcRemoveInterval = null;
let gameStartTime = 0;

async function casinoRoofTerrace(npcNumber) {
    if (npcNumber < 1) throw new Error("Invalid npc number");
    for (let i = 0; i < npcNumber; i++) {
        const model = randomModel();
        const pos = randomSpawnPoint();
        const npc = new NPC(model, pos, alt.Vector3.zero);
        await npc.ready();
    }
}

async function waitGameFullyStarted() {
    await alt.Utils.waitFor(() => gameFullyStarted, 15000);
}

export async function initGame() {
    if (gameInit || gameStarted) return;
    gameInit = true;
    alt.on("playerConnect", onPlayerConnect);
    alt.emit("guesswho:game:init");
    alt.emitAllClients("guesswho:game:init");

    alt.Utils.Chat.enableCmds(false);

    await alt.Utils.wait(1000);
    await alt.Utils.wait(2000);
    alt.once("resourceStop", stopGame);
    await casinoRoofTerrace(10);
    // await casinoRoofTerrace(MAX_NPC);

    //////// temp
    await alt.Utils.wait(1000);
    startGame();
}

export async function startGame() {
    if (!gameInit || gameStarted) return;
    gameInit = false;
    gameStarted = true;
    alt.on("playerDisconnect", onPlayerDisconnect);
    alt.on("playerDeath", onPlayerDeath);
    Teams.createRandomTeams(Array.from(alt.Player.all));
    await alt.Utils.wait(1000);
    createMapLimits();
    alt.emit("guesswho:game:start");
    Teams.players.forEach((player) => {
        player.emit("guesswho:game:start", randomSpawnPoint());
        player.clearDecorations();
        for (let i = 0; i <= 11; i++) player.clearClothes(i);
        [0, 1, 2, 6, 7].forEach((i) => player.clearProp(i));
        player.removeAllWeapons();
    });
    initHunters();
    initHiders();
    NPC.startRandomAction();
    alt.Player.all.forEach((p) => (p.visible = true));
    await alt.Utils.wait(7000);
    gameFullyStarted = true;
    gameStartTime = alt.getNetTime();
    alt.log("[guesswho] game started");
    const numberOfNpcToRemove = Math.ceil(NPC.all.length / 5);
    npcRemoveInterval = alt.setInterval(() => {
        console.log(`removing ${numberOfNpcToRemove} npcs`);
        for (let i = 0; i < numberOfNpcToRemove; i++) {
            const randomIndex = Math.floor(Math.random() * NPC.all.length);
            NPC.all[randomIndex].destroy();
        }
        console.log(`npcs left: ${NPC.all.length}`);
        if (NPC.all.length === 0) {
            console.log("no npc left");
            checkGameEnd();
            alt.clearInterval(npcRemoveInterval);
            npcRemoveInterval = null;
        }
    }, NPC_REMOVE_TIME);
}

export async function stopGame() {
    if (!gameInit && !gameStarted) return;
    alt.off("playerConnect", onPlayerConnect);
    alt.off("playerDisconnect", onPlayerDisconnect);
    alt.off("playerDeath", onPlayerDeath);
    alt.off("resourceStop", stopGame);
    await waitGameFullyStarted();
    gameInit = false;
    gameStarted = false;
    gameFullyStarted = false;

    alt.emit("guesswho:game:stop");
    alt.emitAllClients("guesswho:game:stop");
    alt.Utils.Chat.enableCmds(true);
    // alt.emit("blips:update:players");

    removeMapLimits();

    if (npcRemoveInterval) {
        alt.clearInterval(npcRemoveInterval);
        npcRemoveInterval = null;
    }
    NPC.clear();
    Teams.hunters.forEach((player) => {
        if (!player.valid) return;
        player.removeAllWeapons();
    });
    Teams.hiders.forEach((player) => {
        if (!player.valid) return;
        player.model = "mp_m_freemode_01";
    });
    Teams.deleteTeams();
}

export async function exitGame() {
    if (!gameInit && !gameStarted) return;
    if (gameStarted) stopGame();
}

async function onPlayerConnect(player) {
    await alt.Utils.waitFor(() => player.isSpawned);
    if (gameInit) player.emit("guesswho:game:init");
    else if (gameStarted) {
        player.pos = new alt.Vector3(964.38, 45.68, 123.12);
        Teams.newSpectator(player);
    }
}

async function onPlayerDisconnect(player, reason) {
    await waitGameFullyStarted();
    Teams.removePlayer(player);
    await alt.Utils.wait(2000);
    checkGameEnd();
}

async function onPlayerDeath(victim, killer, weapon) {
    await alt.Utils.wait(2000);
    Teams.newSpectator(victim);
    await alt.Utils.wait(1000);
    checkGameEnd();
}

async function checkGameEnd() {
    // console.log("checkGameEnd", Teams.remainingHiders === 0, Teams.remainingHunters === 0, alt.getNetTime(), gameStartTime, GAME_TIME_LIMIT);
    if (Teams.remainingHiders === 0 || Teams.remainingHunters === 0 || alt.getNetTime() - gameStartTime > GAME_TIME_LIMIT) {
        const winner = Teams.remainingHiders === 0 ? "hunter" : "hider";
        alt.log(`game ended, winner: ${winner}`);
        alt.emitClient(Teams.players, "guesswho:game:end", winner);
        await alt.Utils.wait(5000);
        stopGame();
    }
}

const MAP_LIMITS = [
    { prop: "prop_fnclink_06c", pos: [932.5, 3.45, 112.75], rot: [0, 0, 1] },
    { prop: "prop_fnclink_06c", pos: [929.26, -1.59, 112.75], rot: [0, 0, 1] },
    { prop: "prop_fnclink_06c", pos: [924.05, 1.55, 112.5], rot: [0, 0, -0.55] },
    { prop: "prop_fnclink_06c", pos: [918.8, 4.77, 112.5], rot: [0, 0, -0.55] },
    { prop: "prop_fnclink_06c", pos: [913.55, 8.05, 112.5], rot: [0, 0, -0.56] },
    { prop: "prop_fnclink_06c", pos: [908.35, 11.33, 112.5], rot: [0, 0, -0.56] },
    { prop: "prop_fnclink_06a", pos: [905.27, 13.26, 112.55], rot: [0, 0, -0.56] },
    { prop: "prop_fnclink_06a", pos: [905.27, 13.26, 112.55], rot: [0, Math.PI, Math.PI - 0.56] },
];

function createMapLimits() {
    MAP_LIMITS.forEach(({ prop, pos, rot }) => {
        const obj = new alt.Object(prop, new alt.Vector3(...pos), new alt.Vector3(...rot));
        obj.setMeta("type", "guesswho:limit");
    });
}

function removeMapLimits() {
    alt.Object.all.forEach((obj) => {
        if (obj.getMeta("type") === "guesswho:limit") obj.destroy();
    });
}

// alt.Utils.Chat.registerCmd({
//     name: "limit",
//     args: [
//         {
//             name: "x",
//             type: "number",
//             required: true,
//         },
//         {
//             name: "y",
//             type: "number",
//             required: true,
//         },
//         {
//             name: "z",
//             type: "number",
//             required: true,
//         },
//     ],
//     execute: (player, args) => {
//         alt.Object.all.filter((obj) => !obj.getSyncedMeta("guesswho:limit")).forEach((obj) => obj.destroy());
//         const [x, y, z, rx, ry, rz] = args.map((arg) => parseFloat(arg));
//         new alt.Object(LIMIT_PROP, new alt.Vector3(x, y, z), new alt.Vector3(rx, ry, rz));
//     },
// });
