import * as alt from "alt-client";
import * as native from "natives";
import * as loc from "./locations.js";

import "./class/index.js";
import "./prototype/index.js";
import "./webview/index.js";

// import "./garage.js"
// import "./musicPlayer.js"
import "./nametag.js";
import "./track.js";
import "./noclip.js";
import "./players.js";
// import "./time-weather.js";
import "./vehicles.js";

const player = alt.Player.local;

alt.loadDefaultIpls();
alt.setWatermarkPosition(0);

alt.once("spawned", () => {
    loc.loadInteriors();
    loc.loadCayoPericoIsland();
});

alt.on("anyResourceStart", (resourceName) => {
    if (player.authorized(2)) {
        player.notify({
            imageName: "CHAR_MP_FM_CONTACT",
            headerMsg: resourceName,
            detailsMsg: `La ressource a bien redémarré.`,
            message: "",
        });
    }
});
// alt.on("setGodMode", (enable) => native.setPlayerInvincible(player, enable));

// alt.onServer("audio", () => {
//     const audio = new alt.Audio("http://35.180.39.87/altv-musicPlayer/stored/test.mp3", 1, "music", false);
//     // const clone = native.clonePed(player, true, false, false);
//     // const obj = new alt.Object("prop_beach_fire", player.pos, new alt.Vector3(0), true, true, true, 10);

//     // const audio = new alt.Audio("http://resource/client/test.mp3", 1, "music", false);
//     audio.addOutput(player);
//     // audio.addOutput(clone);
//     // audio.addOutput(obj);
//     // console.log(audio.getOutputs());
//     // console.log(audio.playing);
//     audio.play();
//     console.log(audio.playing);
//     console.log(audio.volume);
//     audio.volume = 1;
//     // console.log(audio.playing);
// });
