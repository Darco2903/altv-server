import * as alt from "alt-client";
import * as native from "natives";

const LOG_PREFIX = "~y~[Clock]~w~";
const DEFAULT_SPEED = 2000; //  2 real seconds = 1 game second

alt.on("resourceStop", () => {
    alt.setMsPerGameMinute(DEFAULT_SPEED);
    native.pauseClock(false);
    alt.logDebug(LOG_PREFIX, "Internal clock reset");
});

alt.onServer("time:run", (state) => {
    native.pauseClock(!state);
    alt.logDebug(LOG_PREFIX, "Clock", state ? "Started" : "Stopped");
});

alt.onServer(
    "time:setTime",
    /** @param {alt.Utils.TimeData} time */
    ({ hour, minute }) => {
        native.setClockTime(hour, minute, 0);
        alt.logDebug(LOG_PREFIX, `Clock time set to ${hour}:${minute}`);
    }
);

alt.onServer("time:setSpeed", (speed) => {
    alt.setMsPerGameMinute(DEFAULT_SPEED / speed);
    alt.logDebug(LOG_PREFIX, `Clock speed set to ${speed}`);
});

alt.on("resourceStart", () => {
    alt.emitServer("time:synchronize");
});
