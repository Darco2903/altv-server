import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

function toggleHuntersControls() {
    native.enableControlAction(0, 1, true); // INPUT_LOOK_LR
    native.enableControlAction(0, 2, true); // INPUT_LOOK_UD
    native.enableControlAction(0, 59, true); // INPUT_VEH_MOVE_LEFT_ONLY
    native.enableControlAction(0, 68, true); // INPUT_VEH_AIM
    native.enableControlAction(0, 71, true); // INPUT_VEH_ACCELERATE
    native.enableControlAction(0, 72, true); // INPUT_VEH_ACCELERATE
    native.enableControlAction(0, 74, true); // INPUT_VEH_HEADLIGHT
    native.enableControlAction(0, 76, true); // INPUT_VEH_HANDBRAKE
    native.enableControlAction(0, 79, true); // INPUT_VEH_LOOK_BEHIND
}

alt.onServer("upn:game:start", () => {});

export { toggleHuntersControls };
