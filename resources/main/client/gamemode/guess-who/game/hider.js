import * as alt from "alt-client";
import * as native from "natives";
import * as anim from "./animations.js";

const SELECTOR_MAX_DISTANCE = 15;

const inputKeys = {
    wave: { keyBind: 1, control: 49 },
    phone: { keyBind: 2, control: 50 },
    sound: { keyBind: 3, control: 51 },
};

/** @type {alt.Marker} */
let selectionMarker;
/** @type {alt.Ped} */
let selectedPed;
let controlTick;
let teammateTick;
let teammatesMarkers = [];
/** @type {alt.WebView} */
let hudView;

const player = alt.Player.local;

function pedSelection() {
    const e = alt.Ped.all[0];
    if (!e) return;

    selectionMarker?.destroy();
    selectionMarker = undefined;
    selectedPed = undefined;

    const npc = alt.Ped.streamedIn
        .filter((ped) => ped.pos.distanceTo(player.pos) < SELECTOR_MAX_DISTANCE && playerEntityLookAngle(ped) < 0.1)
        .sort((a, b) => playerEntityLookAngle(a) - playerEntityLookAngle(b))[0];

    if (!npc) return;
    selectedPed = npc;
    selectionMarker = new alt.Marker(23, npc.pos.sub(0, 0, 0.98), alt.RGBA.red);
    selectionMarker.scale = selectionMarker.scale.mul(1.2);
}

function playerEntityLookAngle(entity) {
    const v = entity.pos.sub(player.pos);
    const angle = Math.PI - Math.acos(v.y / v.length);
    const cam = native.getGameplayCamRelativeHeading(player) + 180;
    const h = native.getEntityHeading(player);
    const heading = (cam + h) % 360;
    let radHeading = ((heading % 180) * Math.PI) / 180;
    if (heading > 180) radHeading = Math.PI - radHeading;
    return Math.abs(angle - radHeading);
}

let animLock = false;

async function hiderKeyBinds(key) {
    // if (animLock) return;
    if (key === 69 && selectedPed && player.model !== selectedPed.model) {
        const model = selectedPed.model;
        // console.log(selectedPed.model);
        const camHeading = native.getGameplayCamRelativeHeading(player);
        const camPitch = native.getGameplayCamRelativePitch(player);
        // const speed = native.getEntitySpeedVector(player, true);
        // console.log(speed);
        // native.setPlayerModel(player, model);
        alt.emitServer("guesswho:changeModel", model);
        await alt.Utils.waitFor(() => player.model === model, 2000);

        native.setGameplayCamRelativeHeading(camHeading);
        native.setGameplayCamRelativePitch(camPitch, 1);
        // native.setVelocity(player, speed.x, speed.y, speed.z);
    } else if (!animLock) {
        switch (key) {
            case inputKeys.wave.control:
                animLock = true;
                hudView.emit("perk:play", "wave");
                await anim.wave(player);
                hudView.emit("perk:stop", "wave");
                animLock = false;
                break;

            case inputKeys.phone.control:
                animLock = true;
                hudView.emit("perk:play", "phone");
                await anim.takePhone(player);
                hudView.emit("perk:stop", "phone");
                animLock = false;
                break;

            case inputKeys.sound.control:
                animLock = true;
                hudView.emit("perk:play", "sound");
                alt.emitServer("guesswho:sound:play");
                await alt.Utils.wait(4000);
                hudView.emit("perk:stop", "sound");
                animLock = false;
                break;
        }
    }
}

function getTeammates() {
    return alt.Player.all.filter((p) => p !== player && p.getStreamSyncedMeta("guesswho:team") === "hider");
}

export function initHider() {
    if (teammateTick) return;
    teammateTick = alt.everyTick(() => {
        teammatesMarkers.forEach((m) => m.destroy());
        teammatesMarkers = getTeammates().map((p) => {
            return new alt.Marker(23, p.pos.sub(0, 0, 0.98), new alt.RGBA(0, 100, 255, 255));
        });
    });
}

export function stopHider() {
    if (teammateTick) alt.clearEveryTick(teammateTick);
    teammateTick = null;
    teammatesMarkers.forEach((m) => m.destroy());
    teammatesMarkers = [];
}

export function toggleHiderControls(state) {
    if (state && !controlTick) {
        alt.on("keydown", hiderKeyBinds);
        native.setEntityProofs(player, false, false, false, false, true, false, false, false);
        hudView = new alt.WebView("http://resource/client/gamemode/guess-who/game/browser/hiderHud.html", true);
        hudView.emit("perk:setup", "wave", inputKeys.wave.keyBind);
        hudView.emit("perk:setup", "phone", inputKeys.phone.keyBind);
        hudView.emit("perk:setup", "sound", inputKeys.sound.keyBind);
        controlTick = alt.everyTick(() => {
            pedSelection();
            native.hideHudAndRadarThisFrame();
            native.disableAllControlActions(0);
            native.enableControlAction(0, 0, true); // INPUT_NEXT_CAMERA
            native.enableControlAction(0, 1, true); // INPUT_LOOK_LR
            native.enableControlAction(0, 2, true); // INPUT_LOOK_UD
            native.enableControlAction(0, 21, true); // INPUT_SPRINT
            native.enableControlAction(0, 22, true); // INPUT_JUMP
            native.enableControlAction(0, 24, true); // INPUT_ATTACK
            native.enableControlAction(0, 26, true); // INPUT_LOOK_BEHIND
            native.enableControlAction(0, 30, true); // INPUT_LOOK_BEHIND
            native.enableControlAction(0, 31, true); // INPUT_LOOK_BEHIND
            native.enableControlAction(0, 142, true); // INPUT_MELEE_ATTACK_ALTERNATE
        });
    } else if (!state && controlTick) {
        alt.off("keydown", hiderKeyBinds);
        hudView.emit("fade:out");
        alt.Utils.wait(500).then(() => {
            hudView.destroy();
            hudView = null;
        });
        if (controlTick) alt.clearEveryTick(controlTick);
        controlTick = null;
        selectionMarker?.destroy();
        selectedPed = undefined;
        native.setEntityProofs(player, false, false, false, false, false, false, false, false);
    }
}
