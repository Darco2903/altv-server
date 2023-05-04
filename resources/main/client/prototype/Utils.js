import * as alt from "alt-client";
import * as native from "natives";
import * as chat from "../webview/chat.js";

alt.Utils.enableChat = chat.enable;
alt.Utils.isChatEnabled = chat.isEnabled;
alt.Utils.isChatOpen = chat.isOpen;

alt.Utils.drawNotification = function ({ imageName = "CHAR_DEFAULT", headerMsg = "", detailsMsg = "", message = "" }) {
    native.beginTextCommandThefeedPost("STRING");
    native.addTextComponentSubstringPlayerName(message);
    native.endTextCommandThefeedPostMessagetextTu(imageName.toUpperCase(), imageName.toUpperCase(), false, 4, headerMsg, detailsMsg, 0.5);
    native.endTextCommandThefeedPostTicker(false, false);
};

alt.Utils.getWaypointPos = function () {
    const waypoint = native.getFirstBlipInfoId(8);
    if (!native.doesBlipExist(waypoint)) {
        alt.emit("notificationRaw", "CHAR_BLOCKED", "Commande", "tpm", "Un repère GPS est requis pour cette commande");
        return;
    }
    let pos = native.getBlipInfoIdCoord(waypoint); //.add(0, 0, 100);
    // let [floor, z] = native.getGroundZFor3dCoord(...pos.toArray(), 0, 0);
    return pos;
};

let onlyMoveTick;
alt.Utils.toggleOnlyMove = function (state) {
    if (!onlyMoveTick && state) {
        alt.Utils.enableChat(false);
        onlyMoveTick = alt.everyTick(() => {
            native.disableAllControlActions(0);
            native.enableControlAction(0, 21, true); //  INPUT_SPRINT
            native.enableControlAction(0, 22, true); //  INPUT_JUMP
            // native.enableControlAction(0, 23, true); //  INPUT_ENTER
            native.enableControlAction(0, 30, true); //  INPUT_MOVE_LR
            native.enableControlAction(0, 31, true); //  INPUT_MOVE_UD
            native.enableControlAction(0, 32, true); //  INPUT_MOVE_LR
            native.enableControlAction(0, 71, true); //  INPUT_VEH_ACCELERATE
            native.enableControlAction(0, 72, true); //  INPUT_VEH_BRAKE
            native.enableControlAction(0, 74, true); //  INPUT_VEH_HEADLIGHT
            native.enableControlAction(0, 76, true); //  INPUT_VEH_HANDBRAKE
            native.enableControlAction(0, 59, true); //  INPUT_VEH_MOVE_LR
            native.enableControlAction(0, 86, true); //  INPUT_VEH_HORN
            native.disableFrontendThisFrame();
        });
    } else if (onlyMoveTick && !state) {
        alt.Utils.enableChat(true);
        alt.clearEveryTick(onlyMoveTick);
        onlyMoveTick = null;
    }
};

let tunerControls;
alt.Utils.toggleTunerControls = function (state) {
    if (!tunerControls && state) {
        alt.Utils.enableChat(false);
        native.freezeEntityPosition(alt.Player.local.vehicle, true);
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
        alt.Utils.enableChat(true);
        native.freezeEntityPosition(alt.Player.local.vehicle, false);
        alt.clearEveryTick(tunerControls);
        tunerControls = null;
    }
};
