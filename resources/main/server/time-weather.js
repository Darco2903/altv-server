import * as alt from "alt-server";

function initClock() {
    if (alt.hasMeta("time")) {
        alt.Utils.clock.init(alt.getMeta("time"));
    } else {
        alt.Utils.clock.start();
    }
}

alt.on("serverStarted", initClock);

alt.on("resourceStart", () => {
    if (alt.hasMeta("serverStarted")) {
        initClock();
    }
});

alt.on("resourceStop", () => {
    alt.setMeta("time", alt.Utils.clock.getTimeData());
    //alt.setMeta("weather", )
});

alt.on("playerConnect", (player) => {
    const time = alt.Utils.clock.getTimeData();
    player.emit("time:setTime", time);
    player.emit("time:setSpeed", time.speed);
    player.emit("time:run", time.started);
});

/**
 * @param {alt.Player} player
 */
function syncronize(player) {
    const time = alt.Utils.clock.getTimeData();
    if (player) {
        player.emit("time:setTime", time);
        player.emit("time:setSpeed", time.speed);
        player.emit("time:run", time.started);
    } else {
        alt.emitAllClients("time:setTime", time);
        alt.emitAllClients("time:setSpeed", time.speed);
        alt.emitAllClients("time:run", time.started);
    }
}
alt.onClient("time:synchronize", syncronize);

// alt.setInterval(() => {
//     console.log(alt.Utils.clock.getTime());
// }, 2000);
