import * as alt from "alt-server";

import Teams from "../teams.js";
import { randomModel } from "../utils.js";
import SyncedAudio from "../../../../core/audio/SyncedAudio.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const soundboards = require("../../../../../../data-pack/content/sounds/soundboards.json");

alt.onClient("guesswho:changeModel", (player, model) => {
    player.model = model;
});

function randomSound() {
    return soundboards[Math.floor(Math.random() * soundboards.length)];
}

alt.onClient("guesswho:sound:play", async (player) => {
    const sound = new SyncedAudio({
        source: `http://assets/data-pack/content/sounds/soundboards/${randomSound()}`,
        volume: 0.6,
        autoPlay: true,
        autoDestroy: true,
    });
    sound.setOutputOnEntity(player);
});

export function initHiders() {
    Teams.hiders.forEach((player) => {
        player.model = randomModel();
        player.maxHealth = 200;
        player.health = 200;
    });
}

// alt.on("resourceStart", () => {
//     alt.Utils.wait(2000).then(() => {
//         alt.log("playing sound");
//         const sound = new SyncedAudio({
//             source: `http://assets/data-pack/content/sounds/soundboards/${randomSound()}`,
//             volume: 0.6,
//             autoPlay: true,
//             autoDestroy: true,
//         });
//         sound.setOutputOnEntity(alt.Player.all[0]);

//         setInterval(() => {
//             console.log("sound valid", SyncedAudio.all.includes(sound));
//         }, 1000);
//     });
// });
