import * as alt from "alt-server";

import NPC from "./npc.js";
// import Teams from "./teams.js";
import { initGame, stopGame } from "./game.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const npcModels = require("./npcModels.json");
const npcSpawnPoints = require("./npcSpawnPoints.json");

alt.on("resourceStart", () => {
    if (!alt.getMeta("server:started")) return;
    // init();
    // casinoRoofTerrace();
});

alt.on("resourceStart", () => {
    alt.Ped.all.forEach((ped) => {
        ped.destroy();
    });
});

alt.Utils.Chat.registerCmd({
    name: "guesswho",
    args: [
        {
            name: "action",
            type: "string",
            required: false,
            values: ["start", "stop"],
        },
    ],
    permissionLevel: 3,
    execute: (player, [action]) => {
        switch (action) {
            case "start":
                if (alt.Player.all.length < 2) {
                    // throw new Error("Not enough players to create teams.");
                    player.sendNotification({
                        imageName: "CHAR_BLOCKED",
                        title: "GuessWho",
                        message: "Pas assez de joueurs pour démarrer une partie.",
                    });
                    // return;
                }
                initGame();
                break;
            case "stop":
                stopGame();
                break;
        }
    },
});

////////////////////

// alt.on("playerConnect", (player) => {
//     player.pos = new alt.Vector3(946, 47, 112);
// });

async function init() {
    await alt.Utils.wait(2000);
    // const ped = new alt.Ped("s_m_m_movalien_01", new alt.Vector3(180, -1030, 29), alt.Vector3.zero);

    // const npc = new NPC("A_F_Y_Beach_01", new alt.Vector3(180, -1045, 29), alt.Vector3.zero);
    // const npc = new NPC("A_F_Y_Beach_01", new alt.Vector3(206.67, -923.77, 30.69), alt.Vector3.zero);
    const npc = new NPC("A_F_Y_Beach_01", new alt.Vector3(946, 47, 112), alt.Vector3.zero);
    const npc1 = new NPC("A_M_Y_BeachVesp_01", new alt.Vector3(946, 47, 112), alt.Vector3.zero);
    // const npc = new NPC("A_M_Y_BeachVesp_01", new alt.Vector3(206.67, -923.77, 30.69), alt.Vector3.zero);
    await alt.Utils.wait(1000);
    NPC.startRandomAction();
    // alt.emitAllClients("guesswho:game:spectate", alt.Player.all[0]);
    // alt.emitAllClients("guesswho:game:spectate", npc.ped);
    // await alt.Utils.wait(5000);
    // alt.emitAllClients("guesswho:game:spectate", npc1.ped);
    // await alt.Utils.wait(5000);
    // alt.emitAllClients("guesswho:game:spectate:stop");
    // await npc.heading(30);
    // console.log("heading done (main)");

    // await npc.goto(5);
    // console.log("goto done (main)");

    // await npc.faceEntity(alt.Player.all[0]);
    // console.log("faceEntity done (main)");

    // await npc.jump();
    // console.log("jump done (main)");

    // await npc.wave();
    // console.log("wave done (main)");

    // await npc.phone();
    // console.log("phone done (main)");
}
