import * as alt from "alt-client";
import * as native from "natives";
import { loadCayoPericoIsland, loadInteriors, loadtrains } from "./locations.js";

import "./chat.js";
import "./nametag.js";

const player = alt.Player.local;

alt.loadDefaultIpls();
alt.setWatermarkPosition(0);

alt.once("spawned", () => {
    loadInteriors();
    loadCayoPericoIsland();
});

// alt.setMeta("displayNametag", true);

// alt.setMeta("controls", true);
// alt.on("main:toogleControls", (enable) => alt.setMeta("controls", enable));

// alt.on("setGodMode", (enable) => native.setPlayerInvincible(player, enable));

// alt.on("keydown", (key) => {
//     if (!alt.gameControlsEnabled()) return;

//     switch (key) {
//         case 192: //  *
//             native.setPedToRagdoll(alt.Player.local.scriptID, 1, 10000, 0, false, false, false);
//             native.setPlayerControl(alt.Player.local.scriptID, true, 1);
//             break;
//     }

//     return;
//     //A
//     if (key == 65) {
//     }
//     //F
//     if (key == 70) {
//     }

//     //Z
//     if (key == 90) {
//     }
// });

// alt.onServer("debug", (enabled) => {
//     alt.emit("notification", "success", `debug: ${enabled}`);
// });
