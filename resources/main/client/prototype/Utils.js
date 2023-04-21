import * as alt from "alt-client";
import * as native from "natives";

let onlyVehMoveTick;
let tunerControls;

alt.Utils.prototype.toggleOnlyVehMove = function (state) {
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
        alt.clearEveryTick(onlyVehMoveTick);
        onlyVehMoveTick = null;
    }
};

alt.Utils.prototype.toggleTunerControls = function (state) {
    if (!tunerControls && state) {
        tunerControls = alt.everyTick(() => {
            native.disableAllControlActions(0);
            native.enableControlAction(0, 74, true); //  INPUT_VEH_HEADLIGHT
            native.enableControlAction(0, 86, true); //  INPUT_VEH_HORN
            if (alt.isKeyDown(2) /* RIGHT_CLICK */) {
                if (alt.isCursorVisible()) alt.showCursor(false);
                native.enableControlAction(0, 1, true); //  INPUT_LOOK_LR
                native.enableControlAction(0, 2, true); //  INPUT_LOOK_UD
            } else if (!alt.isCursorVisible()) {
                alt.showCursor(true);
            }
        });
    } else if (tunerControls && !state) {
        alt.clearEveryTick(tunerControls);
        tunerControls = null;
    }
};

/**
 * @param {string} msg
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 * @param {Number} z z coordinate
 * @param {Number} scale
 * @param {Number} fontType
 * @param {Number} r 0-255
 * @param {Number} g 0-255
 * @param {Number} b 0-255
 * @param {Number} a 0-1
 * @param {boolean} useOutline
 * @param {boolean} useDropShadow
 * @param {Number} layer
 */
alt.Utils.prototype.drawText3d = function (msg, x, y, z, scale, fontType, r, g, b, a, useOutline = true, useDropShadow = true, layer = 0) {
    // let hex = msg.match("{.*}");
    // if (hex) {
    //     const rgb = hexToRgb(hex[0].replace("{", "").replace("}", ""));
    //     r = rgb[0];
    //     g = rgb[1];
    //     b = rgb[2];
    //     msg = msg.replace(hex[0], "");
    // }

    native.setDrawOrigin(x, y, z, 0);
    native.beginTextCommandDisplayText("STRING");
    native.addTextComponentSubstringPlayerName(msg);
    native.setTextFont(fontType);
    native.setTextScale(1, scale);
    native.setTextWrap(0.0, 1.0);
    native.setTextCentre(true);
    native.setTextColour(r, g, b, a);

    if (useOutline) {
        native.setTextOutline();
    }

    if (useDropShadow) {
        native.setTextDropShadow();
    }

    native.endTextCommandDisplayText(0, 0, 0);
    native.clearDrawOrigin();
};

/**
 * @param {Object} options
 * @param {string} [options.imageName]
 * @param {string} [options.headerMsg]
 * @param {string} [options.detailsMsg]
 * @param {string} [options.message]
 */
alt.Utils.prototype.drawNotification = function ({ imageName = "CHAR_DEFAULT", headerMsg = "", detailsMsg = "", message = "" }) {
    native.beginTextCommandThefeedPost("STRING");
    native.addTextComponentSubstringPlayerName(message);
    native.endTextCommandThefeedPostMessagetextTu(imageName.toUpperCase(), imageName.toUpperCase(), false, 4, headerMsg, detailsMsg, 0.5);
    native.endTextCommandThefeedPostTicker(false, false);
};
