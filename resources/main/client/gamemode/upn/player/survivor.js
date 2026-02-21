import * as alt from "alt-client";
import * as native from "natives";

const EXPLOSION_COOLDOWN = 5000;
const DEBUG_EXPLOSION = false;

const player = alt.Player.local;
let explosionCooldown = false;
let weaponCooldown = false;

async function explode(p) {
    if (explosionCooldown) return;
    explosionCooldown = true;
    alt.setTimeout(() => (explosionCooldown = false), EXPLOSION_COOLDOWN);

    const pos = p.pos;
    const posDiff = 5;

    // native.setPedConfigFlag(player, 108, true);

    native.addExplosion(pos.x, pos.y, pos.z, 64, 1, true, false, 1, true);
    // native.addExplosion(pos.x, pos.y, pos.z, 65, 1, true, false, 1, true);

    native.addExplosion(pos.x, pos.y, pos.z, 81, 1, false, !DEBUG_EXPLOSION, 0, true);

    native.addExplosion(pos.x + posDiff, pos.y, pos.z, 81, 1, false, !DEBUG_EXPLOSION, 0, true);
    native.addExplosion(pos.x - posDiff, pos.y, pos.z, 81, 1, false, !DEBUG_EXPLOSION, 0, true);
    native.addExplosion(pos.x, pos.y + posDiff, pos.z, 81, 1, false, !DEBUG_EXPLOSION, 0, true);
    native.addExplosion(pos.x, pos.y - posDiff, pos.z, 81, 1, false, !DEBUG_EXPLOSION, 0, true);

    // native.addExplosion(pos.x + 2 * posDiff, pos.y, pos.z, 81, 1, false, !debug, 0, true);
    // native.addExplosion(pos.x - 2 * posDiff, pos.y, pos.z, 81, 1, false, !debug, 0, true);
    // native.addExplosion(pos.x, pos.y + 2 * posDiff, pos.z, 81, 1, false, !debug, 0, true);
    // native.addExplosion(pos.x, pos.y - 2 * posDiff, pos.z, 81, 1, false, !debug, 0, true);
    // native.addExplosion(pos.x + posDiff, pos.y + posDiff, pos.z, 81, 1, false, !debug, 0, true);
    // native.addExplosion(pos.x - posDiff, pos.y - posDiff, pos.z, 81, 1, false, !debug, 0, true);
    // native.addExplosion(pos.x + posDiff, pos.y - posDiff, pos.z, 81, 1, false, !debug, 0, true);
    // native.addExplosion(pos.x - posDiff, pos.y + posDiff, pos.z, 81, 1, false, !debug, 0, true);

    // native.setPedConfigFlag(player, 108, false);
}

function toggleSurvivorsControls() {
    native.enableControlAction(0, 1, true); // INPUT_LOOK_LR
    native.enableControlAction(0, 2, true); // INPUT_LOOK_UD
    native.enableControlAction(0, 21, true); // INPUT_SPRINT
    native.enableControlAction(0, 22, true); // INPUT_JUMP
    native.enableControlAction(0, 24, true); // INPUT_ATTACK
    native.enableControlAction(0, 25, true); // INPUT_AIM
    native.enableControlAction(0, 26, true); // INPUT_LOOK_BEHIND
    native.enableControlAction(0, 30, true); // INPUT_MOVE_LR
    native.enableControlAction(0, 31, true); // INPUT_MOVE_LR
    native.enableControlAction(0, 44, true); // INPUT_COVER
    native.hideHudComponentThisFrame(2);

    if (native.isControlPressed(0, 24) && !weaponCooldown) {
        weaponCooldown = true;
        setTimeout(() => {
            native.refillAmmoInstantly(player);
            weaponCooldown = false;
        }, 500);
    }

    if (native.isControlJustPressed(0, 21)) {
        native.setRunSprintMultiplierForPlayer(player, 1.49);
    }
    if (native.isControlJustReleased(0, 21)) {
        native.setRunSprintMultiplierForPlayer(player, 1);
    }
}

function survivorCommands(key) {
    if (key === 69) {
        // E
        alt.emitServer("upn:survivor:explode");
    }
}

alt.onServer("upn:survivor:explode", (player) => {
    explode(player);
});

export { toggleSurvivorsControls, survivorCommands };
