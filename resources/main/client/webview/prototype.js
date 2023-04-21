import * as alt from "alt-client";
import * as native from "natives";

alt.WebView.prototype.toggle = function (state) {
    this.isVisible = state;
    alt.showCursor(state);
    if (state) {
        this.focus();
    } else {
        this.unfocus();
    }
};

alt.WebView.prototype.centerPointer = function () {
    const cursosPos = alt.getScreenResolution().div(2);
    alt.setCursorPos(cursosPos);
};

let onlyVehMoveTick;

alt.WebView.prototype.toggleOnlyVehMove = function (state) {
    if (!onlyVehMoveTick && state) {
        onlyVehMoveTick = alt.everyTick(() => {
            native.disableAllControlActions(0);
            native.enableControlAction(0, 71, true); //  INPUT_VEH_ACCELERATE
            native.enableControlAction(0, 72, true); //  INPUT_VEH_BRAKE
            native.enableControlAction(0, 74, true); //  INPUT_VEH_HEADLIGHT
            native.enableControlAction(0, 76, true); //  INPUT_VEH_HANDBRAKE
            native.enableControlAction(0, 59, true); //  INPUT_VEH_MOVE_LR
            native.enableControlAction(0, 86, true); //  INPUT_VEH_HORN
        });
    } else if (onlyVehMoveTick && !state) {
        alt.clearEveryTick(this.onlyVehMoveTick);
        this.onlyVehMoveTick = null;
    }
};
