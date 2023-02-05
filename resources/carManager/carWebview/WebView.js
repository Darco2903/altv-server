import * as alt from "alt-client";
import * as native from "natives";

alt.WebView.prototype.toogle = function (state) {
    // console.log(state);
    this.isVisible = state;
    alt.showCursor(state);
    if (state) this.focus();
    else this.unfocus();
    alt.setMeta("webviewBlock", state ? this : null);
};

alt.WebView.prototype.centerPointer = function () {
    const cursosPos = alt.getScreenResolution().div(2);
    alt.setCursorPos(cursosPos);
};

alt.WebView.prototype.toogleChat = function (state) {
    alt.emit("chat:toogle", state);
};

alt.WebView.prototype.toogleOnlyVehMove = function (state) {
    // console.log(!!this.onlyVehMoveTick, state);
    alt.setMeta("controlsEnabled", state && alt.gameControlsEnabled());
    switch (true) {
        case this.onlyVehMoveTick && !state:
        case !this.onlyVehMoveTick && state:
            break;

        case !!this.onlyVehMoveTick:
            // console.log("clear");
            alt.clearEveryTick(this.onlyVehMoveTick);
            this.onlyVehMoveTick = null;
            break;

        default:
            this.onlyVehMoveTick = alt.everyTick(() => {
                native.disableAllControlActions(0);
                native.enableControlAction(0, 71, true); //  INPUT_VEH_ACCELERATE
                native.enableControlAction(0, 72, true); //  INPUT_VEH_BRAKE
                native.enableControlAction(0, 74, true); //  INPUT_VEH_HEADLIGHT
                native.enableControlAction(0, 76, true); //  INPUT_VEH_HANDBRAKE
                native.enableControlAction(0, 59, true); //  INPUT_VEH_MOVE_LR
                native.enableControlAction(0, 86, true); //  INPUT_VEH_HORN
            });
            break;
    }
};
