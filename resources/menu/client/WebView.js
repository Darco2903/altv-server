import * as alt from "alt-client";
import * as native from "natives";

alt.WebView.prototype.toogle = function (state) {
    console.log(state);
    this.isVisible = state;
    alt.showCursor(state);
    if (state) this.focus();
    else this.unfocus();
    alt.setMeta("webviewBlock", state ? this : null);
};

function disableControlAction(state) {
    return `main:disabledControl${state ? "Remove" : "Add"}`;
}

alt.WebView.prototype.toogleChat = function (state) {
    alt.emit("chat:toogle", state);
};

alt.WebView.prototype.toogleCamControl = function (state) {
    alt.emit(disableControlAction(state), 0, 1); //  INPUT_LOOK_LR
    alt.emit(disableControlAction(state), 0, 2); //  INPUT_LOOK_UD
};
/*
alt.WebView.prototype.camOnRightClick = function (state) {
    if (this.isCamOnRightClick === state) return;
    this.isCamOnRightClick = state;
    this.toogleCamControl(!state);
    if (state) {
        alt.on("keydown", (key) => this.keyDown(key));
        alt.on("keyup", (key) => this.keyUp(key));
    } else {
        alt.off("keydown", (key) => this.keyDown(key));
        alt.off("keyup", (key) => this.keyUp(key));
    }
};

alt.WebView.prototype.keyDown = function (key) {
    console.log(this);
    if (key === 2) this.toogleCamControl(true);
};

alt.WebView.prototype.keyUp = function (key) {
    if (key === 2) this.toogleCamControl(false);
};
*/
alt.WebView.prototype.toogleVehicleExitControl = function (state) {
    alt.emit(disableControlAction(state), 0, 75); //  INPUT_VEH_EXIT
};

alt.WebView.prototype.toogleFrontEndControl = function (state) {
    alt.emit(disableControlAction(state), 2, 200); //  INPUT_VEH_EXIT
};

alt.WebView.prototype.centerPointer = function () {
    const cursosPos = alt.getScreenResolution().div(2);
    alt.setCursorPos(cursosPos);
};
