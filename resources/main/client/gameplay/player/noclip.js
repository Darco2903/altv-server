import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let NoclipActive = false;
let MovingSpeed = 0;
let Scale = -1;
let FollowCamMode = true;

let PlayerVisible = true;

const SpeedsCount = 5;
const speeds = {
    0: "Très lent",
    1: "Lent",
    2: "Normal",
    3: "Rapide",
    4: "Très rapide",
};

const controls = {
    forward: 90, // Z
    backward: 83, // S
    left: 81, // Q
    right: 68, // D
    up: 32, // SPACE
    down: 16, // LSHIFT
    visibility: 4, // Mouse 3
    speedUp: 6, // Mouse 6
    speedDown: 5, // Mouse 5
    toggle: 112, // F1
};

const enabledControls = {
    nextCamera: 0,
    lookLeftRight: 1,
    lookUpDown: 2,
    headLight: 74,
    horn: 88,
    frontEnd: 199,
};

alt.everyTick(() => {
    if (NoclipActive) {
        Scale = native.requestScaleformMovie("INSTRUCTIONAL_BUTTONS");

        if (!native.isHudHidden()) {
            native.beginScaleformMovieMethod(Scale, "CLEAR_ALL");
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(Scale, "SET_DATA_SLOT");
            native.scaleformMovieMethodAddParamInt(0);
            native.scaleformMovieMethodAddParamInt(controls.toggle - 7);
            native.scaleformMovieMethodAddParamInt(controls.toggle - 8);
            native.scaleformMovieMethodAddParamTextureNameString(`Vitesse (${speeds[MovingSpeed]})`);
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(Scale, "SET_DATA_SLOT");
            native.scaleformMovieMethodAddParamInt(1);
            native.scaleformMovieMethodAddParamTextureNameString("~INPUT_LOOK_LR~");
            native.scaleformMovieMethodAddParamTextureNameString("Vue");
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(Scale, "SET_DATA_SLOT");
            native.scaleformMovieMethodAddParamInt(2);
            native.scaleformMovieMethodAddParamTextureNameString("~INPUT_MOVE_LR~");
            native.scaleformMovieMethodAddParamTextureNameString("~INPUT_MOVE_UD~");
            native.scaleformMovieMethodAddParamTextureNameString("Mouvement");
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(Scale, "SET_DATA_SLOT");
            native.scaleformMovieMethodAddParamInt(3);
            // native.scaleformMovieMethodAddParamTextureNameString("~INPUT_SPRINT~");
            native.scaleformMovieMethodAddParamTextureNameString("Descendre [Shift]");
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(Scale, "SET_DATA_SLOT");
            native.scaleformMovieMethodAddParamInt(4);
            native.scaleformMovieMethodAddParamTextureNameString("~INPUT_JUMP~");
            native.scaleformMovieMethodAddParamTextureNameString("Monter");
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(Scale, "SET_DATA_SLOT");
            native.scaleformMovieMethodAddParamInt(5);
            native.scaleformMovieMethodAddParamInt(102);
            native.scaleformMovieMethodAddParamTextureNameString(`Visibilité (${PlayerVisible ? "Visible" : "Invisible"})`);
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(Scale, "SET_DATA_SLOT");
            native.scaleformMovieMethodAddParamInt(6);
            native.scaleformMovieMethodAddParamInt(170);
            native.scaleformMovieMethodAddParamTextureNameString("NoClip");
            native.endScaleformMovieMethod();

            native.beginScaleformMovieMethod(Scale, "DRAW_INSTRUCTIONAL_BUTTONS");
            native.scaleformMovieMethodAddParamInt(0);
            native.endScaleformMovieMethod();

            native.drawScaleformMovieFullscreen(Scale, 255, 255, 255, 255, 0);
        }

        let noclipEntity = alt.Player.local.vehicle ? alt.Player.local.vehicle : alt.Player.local;
        let newPos;

        native.disableAllControlActions(0);
        Object.values(enabledControls).forEach((value) => {
            native.enableControlAction(0, value, true);
        });

        let xoff = 0.0;
        let yoff = 0.0;
        let zoff = 0.0;

        if (native.updateOnscreenKeyboard() !== 0 && alt.isGameFocused()) {
            if (alt.isKeyDown(controls.forward)) {
                yoff = 2;
            }
            if (alt.isKeyDown(controls.backward)) {
                yoff = -2;
            }
            if (alt.isKeyDown(controls.right)) {
                xoff = 2;
            }
            if (alt.isKeyDown(controls.left)) {
                xoff = -2;
            }
            if (alt.isKeyDown(controls.up)) {
                zoff = 1;
            }
            if (alt.isKeyDown(controls.down)) {
                zoff = -1;
            }
        }

        const moveSpeed = ((MovingSpeed + 0.5) / 3) ** 2;
        newPos = native.getOffsetFromEntityInWorldCoords(noclipEntity.scriptID, xoff * moveSpeed, yoff * moveSpeed, zoff * moveSpeed);

        const heading = native.getEntityHeading(noclipEntity.scriptID);
        native.setEntityVelocity(noclipEntity.scriptID, 0, 0, 0);
        native.setEntityRotation(noclipEntity.scriptID, 0, 0, 0, 0, false);
        native.setEntityHeading(noclipEntity.scriptID, FollowCamMode ? native.getGameplayCamRelativeHeading() : heading);
        native.setEntityCoordsNoOffset(noclipEntity.scriptID, newPos.x, newPos.y, newPos.z, true, true, true);
    }
});

function toogleNoClip(state) {
    NoclipActive = state;

    const noclipEntity = alt.Player.local.vehicle ? alt.Player.local.vehicle : alt.Player.local;
    if (NoclipActive) {
        native.freezeEntityPosition(noclipEntity.scriptID, true);
        native.setEntityCollision(noclipEntity.scriptID, false, false);
        if (!PlayerVisible) {
            alt.emitServer("noclip:playerVisible", false);
        }
    } else {
        native.freezeEntityPosition(noclipEntity.scriptID, false);
        native.setEntityCollision(noclipEntity.scriptID, true, true);
        if (!PlayerVisible) {
            alt.emitServer("noclip:playerVisible", true);
        }
    }
}

alt.on("keyup", (key) => {
    if (key === controls.toggle) {
        if (NoclipActive) {
            toogleNoClip(false);
        } else if (player.hasPermission(2)) {
            toogleNoClip(true);
        }
    } else if (NoclipActive) {
        if (key === controls.speedUp) {
            if (MovingSpeed < SpeedsCount - 1) {
                MovingSpeed++;
            }
        } else if (key === controls.speedDown) {
            if (MovingSpeed > 0) {
                MovingSpeed--;
            }
        } else if (key === controls.visibility) {
            PlayerVisible = !PlayerVisible;
            alt.emitServer("noclip:playerVisible", PlayerVisible);
        }
    }
});
