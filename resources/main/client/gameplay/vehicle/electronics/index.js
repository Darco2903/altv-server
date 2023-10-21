import * as alt from "alt-client";
import * as abs from "./abs.js";
import * as esc from "./esc.js";
import * as tc from "./tc.js";
import * as speedController from "./speedController.js";

let updateTick;

function toggle(state) {
    if (state && !updateTick) {
        updateTick = alt.everyTick(() => {
            abs.main();
            tc.main();
            esc.main();
            speedController.main();
        });
    } else if (!state && updateTick) {
        alt.clearEveryTick(updateTick);
        updateTick = null;
    }
}

alt.on("drivingCar", toggle);
