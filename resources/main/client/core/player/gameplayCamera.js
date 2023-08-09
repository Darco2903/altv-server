import * as alt from "alt-client";
import * as native from "natives";

let controlsTick;
let isMoving = false;
let cursorPos;

alt.LocalPlayer.prototype.lockCamera = function (state) {
    if (state && !controlsTick) {
        controlsTick = alt.everyTick(() => {
            native.disableControlAction(0, 1, true); // LookLeftRight
            native.disableControlAction(0, 2, true); // LookUpDown
            native.disableControlAction(0, 24, true); // INPUT_ATTACK
            native.disableControlAction(0, 25, true); // INPUT_AIM
            native.disableControlAction(0, 199, true); // INPUT_FRONTEND_PAUSE
            native.disableControlAction(0, 200, true); // INPUT_FRONTEND_PAUSE_ALTERNATE
            native.disableControlAction(0, 257, true); // INPUT_ATTACK2

            native.hideHudAndRadarThisFrame();

            if (alt.isKeyDown(2)) {
                if (!isMoving) {
                    isMoving = true;
                    cursorPos = alt.getCursorPos();
                    if (alt.isCursorVisible()) alt.showCursor(false);
                }
                native.enableControlAction(0, 1, true); // LookLeftRight
                native.enableControlAction(0, 2, true); // LookUpDown
            } else if (isMoving) {
                isMoving = false;
                alt.setCursorPos(cursorPos);
                if (!alt.isCursorVisible()) alt.showCursor(true);
            }
        });
    } else if (!state && controlsTick) {
        alt.clearEveryTick(controlsTick);
        controlsTick = undefined;
    }
};
