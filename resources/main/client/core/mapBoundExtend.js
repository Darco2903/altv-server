import * as alt from "alt-client";
import * as native from "natives";

alt.everyTick(() => {
    native.extendWorldBoundaryForPlayer(-100000, -100000, 100);
    native.extendWorldBoundaryForPlayer(100000, 100000, 100);
});
