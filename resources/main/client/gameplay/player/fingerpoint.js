import * as alt from "alt-client";
import * as native from "natives";

let active = false;
let interval = null;
let cleanStart = false;
const player = alt.Player.local;
const defaultKeys = {
    point: 66, // B
};
const inputKeys = Object.assign({}, defaultKeys);
const APP_NAME = "fingerpoint";

async function start() {
    if (!active) {
        active = true;
        try {
            await requestAnimDictPromise("anim@mp_point");
            native.setPedCurrentWeaponVisible(player, false, true, true, true);
            native.setPedConfigFlag(player, 36, true);
            native.taskMoveNetworkByName(player, "task_mp_pointing", 0.5, false, "anim@mp_point", 24);
            native.removeAnimDict("anim@mp_point");
            cleanStart = true;
            interval = alt.setInterval(process, 0);
        } catch (error) {
            alt.logError("Promise returned reject Pointing");
        }
    }
}

export function stop() {
    if (active) {
        if (interval) {
            alt.clearInterval(interval);
            interval = null;
        }
        active = false;

        if (cleanStart) {
            cleanStart = false;
            native.requestTaskMoveNetworkStateTransition(player, "Stop");

            if (!native.isPedInjured(player)) {
                native.clearPedSecondaryTask(player);
            }
            if (!native.isPedInAnyVehicle(player, true)) {
                native.setPedCurrentWeaponVisible(player, true, true, true, true);
            }
            native.setPedConfigFlag(player, 36, false);
            native.clearPedSecondaryTask(player);
        }
    }
}

function getRelativePitch() {
    const camRot = native.getGameplayCamRot(2);
    return camRot.x - native.getEntityPitch(player);
}

function process() {
    if (active) {
        native.isTaskMoveNetworkActive(player);
        let camPitch = getRelativePitch();

        if (camPitch < -70.0) {
            camPitch = -70.0;
        } else if (camPitch > 42.0) {
            camPitch = 42.0;
        }
        camPitch = (camPitch + 70.0) / 112.0;

        let camHeading = native.getGameplayCamRelativeHeading();

        const cosCamHeading = Math.cos(camHeading);
        const sinCamHeading = Math.sin(camHeading);

        if (camHeading < -180.0) {
            camHeading = -180.0;
        } else if (camHeading > 180.0) {
            camHeading = 180.0;
        }
        camHeading = (camHeading + 180.0) / 360.0;

        const coords = native.getOffsetFromEntityInWorldCoords(
            player,
            cosCamHeading * -0.2 - sinCamHeading * (0.4 * camHeading + 0.3),
            sinCamHeading * -0.2 + cosCamHeading * (0.4 * camHeading + 0.3),
            0.6
        );

        const ray = native.startShapeTestCapsule(coords.x, coords.y, coords.z - 0.2, coords.x, coords.y, coords.z + 0.2, 1.0, 95, player, 7);
        const [_, blocked, coords1, coords2, entity] = native.getShapeTestResult(ray, false, null, null, null);

        native.setTaskMoveNetworkSignalFloat(player, "Pitch", camPitch);
        native.setTaskMoveNetworkSignalFloat(player, "Heading", camHeading * -1.0 + 1.0);
        native.setTaskMoveNetworkSignalBool(player, "isBlocked", blocked);
        native.setTaskMoveNetworkSignalBool(player, "isFirstPerson", native.getCamViewModeForContext(native.getCamActiveViewModeContext()) === 4);
    }
}

function requestAnimDictPromise(dict) {
    native.requestAnimDict(dict);
    return new Promise((resolve) => {
        const check = alt.everyTick(() => {
            if (native.hasAnimDictLoaded(dict)) {
                alt.clearEveryTick(check);
                resolve(true);
            }
        });
    });
}

alt.on("keydown", (key) => {
    if (key === inputKeys.point) start();
});

alt.on("keyup", (key) => {
    if (key === inputKeys.point) stop();
});

alt.on("resourceStop", () => {
    if (active) stop();
});

alt.on("resourceStart", () => {
    Object.keys(defaultKeys).forEach((name) => {
        inputKeys[name] = alt.LocalStorage.get(`${APP_NAME}:key:${name}`) ?? defaultKeys[name];
        alt.emit("input-manager:keyInit", APP_NAME, name, inputKeys[name]);
    });
    if (alt.isKeyDown(inputKeys.point)) start();
});

alt.on("input-manager:keyUpdate", (app, name, key) => {
    if (app !== APP_NAME) return;
    inputKeys[name] = key;
    alt.LocalStorage.set(`${APP_NAME}:key:${name}`, key);
    alt.LocalStorage.save();
});

alt.on("input-manager:keyReset", (app, name) => {
    if (app !== APP_NAME) return;
    inputKeys[name] = defaultKeys[name];
    alt.emit("input-manager:keyInit", APP_NAME, name, inputKeys[name]);
    alt.LocalStorage.delete(`${APP_NAME}:key:${name}`);
    alt.LocalStorage.save();
});
