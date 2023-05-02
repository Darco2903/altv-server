import * as alt from "alt-client";
import { loadCayoPericoIsland, loadInteriors, loadtrains } from "./locations.js";

import "./nametag.js";
import "./prototype/LocalPlayer.js";
import "./prototype/Utils.js";
import "./prototype/Vehicle/index.js";
import "./prototype/Webview.js";
import "./noclip.js";
import "./players.js";
import "./vehicles.js";
import "./webview/index.js";

alt.loadDefaultIpls();
alt.setWatermarkPosition(0);

alt.once("spawned", () => {
    loadInteriors();
    loadCayoPericoIsland();
});

// alt.on("setGodMode", (enable) => native.setPlayerInvincible(player, enable));
