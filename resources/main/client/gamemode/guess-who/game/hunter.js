import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

/** @type {alt.WebView} */
let aimView;
let controlTick = null;

export function toggleHunterControls(state) {
    if (state && !controlTick) {
        // alt.on("keydown", hunterKeyBinds);
        native.setEntityProofs(player, true, false, false, false, false, false, false, false);
        aimView = new alt.WebView("http://resource/client/gamemode/guess-who/game/browser/aimDot.html", true);
        controlTick = alt.everyTick(() => {
            native.hideHudAndRadarThisFrame();
            native.hideHudComponentThisFrame(14);
            // console.log(aimView, player);
            aimView.isVisible = player.isAiming && !native.isFirstPersonAimCamActive();
            native.disableAllControlActions(0);
            native.enableControlAction(0, 0, true); // INPUT_NEXT_CAMERA
            native.enableControlAction(0, 1, true); // INPUT_LOOK_LR
            native.enableControlAction(0, 2, true); // INPUT_LOOK_UD
            native.enableControlAction(0, 12, true); // INPUT_WEAPON_WHEEL_UD
            native.enableControlAction(0, 13, true); // INPUT_WEAPON_WHEEL_LR
            native.enableControlAction(0, 21, true); // INPUT_SPRINT
            native.enableControlAction(0, 22, true); // INPUT_JUMP
            native.enableControlAction(0, 24, true); // INPUT_ATTACK
            native.enableControlAction(0, 25, true); // INPUT_AIM
            native.enableControlAction(0, 26, true); // INPUT_LOOK_BEHIND
            native.enableControlAction(0, 30, true); // INPUT_LOOK_BEHIND
            native.enableControlAction(0, 31, true); // INPUT_LOOK_BEHIND
            native.enableControlAction(0, 37, true); // INPUT_SELECT_WEAPON
            native.enableControlAction(0, 45, true); // INPUT_RELOAD
            native.enableControlAction(0, 142, true); // INPUT_MELEE_ATTACK_ALTERNATE
        });
    } else if (!state && controlTick) {
        // alt.off("keydown", hunterKeyBinds);
        aimView.destroy();
        aimView = null;
        alt.clearEveryTick(controlTick);
        controlTick = null;
        native.setEntityProofs(player, false, false, false, false, false, false, false, false);
    }
}
