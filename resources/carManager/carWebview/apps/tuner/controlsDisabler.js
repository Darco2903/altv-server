import * as alt from "alt-client";
import * as native from "natives";

alt.WebView.prototype.tunerControlsDisabled = function (state) {
    alt.setMeta("controlsEnabled", state && alt.gameControlsEnabled());
    switch (true) {
        case this.tunerControls && !state:
        case !this.tunerControls && state:
            break;

        case !!this.tunerControls:
            alt.clearEveryTick(this.tunerControls);
            this.tunerControls = null;
            break;

        default:
            this.tunerControls = alt.everyTick(() => {
                native.disableAllControlActions(0);
                native.enableControlAction(0, 74, true); //  INPUT_VEH_HEADLIGHT
                native.enableControlAction(0, 86, true); //  INPUT_VEH_HORN
                if (alt.isKeyDown(2)) {
                    native.enableControlAction(0, 1, true); //  INPUT_LOOK_LR
                    native.enableControlAction(0, 2, true); //  INPUT_LOOK_UD
                }
            });
            break;
    }
};
