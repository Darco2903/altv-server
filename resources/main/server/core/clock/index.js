import * as alt from "alt-server";
import Clock from "./Clock.js";

alt.Utils.Clock = new Clock(12, 0);

function initClock() {
    if (alt.hasMeta("time")) {
        alt.Utils.Clock.init(alt.getMeta("time"));
    } else {
        alt.Utils.Clock.start();
    }
}

alt.on("resourceStart", initClock);

alt.on("resourceStop", () => {
    alt.setMeta("time", alt.Utils.Clock.timeData);
});

alt.on("playerConnect", (player) => {
    const time = alt.Utils.Clock.timeData;
    alt.emitClient(player, "time:setTime", time);
    alt.emitClient(player, "time:setSpeed", time.speed);
    alt.emitClient(player, "time:run", time.started);
});

/**
 * @param {alt.Player} player
 */
function syncronize(player) {
    const time = alt.Utils.Clock.timeData;
    if (player) {
        alt.emitClient(player, "time:setTime", time);
        alt.emitClient(player, "time:setSpeed", time.speed);
        alt.emitClient(player, "time:run", time.started);
    } else {
        alt.emitAllClients("time:setTime", time);
        alt.emitAllClients("time:setSpeed", time.speed);
        alt.emitAllClients("time:run", time.started);
    }
}

alt.onClient("time:synchronize", syncronize);
