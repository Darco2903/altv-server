import * as alt from "alt";
import * as game from "natives";

let active = false;
let interval = null;
let cleanStart = false;
// let gameplayCam = game.createCameraWithParams("gameplay");
let player = alt.Player.local;

export function start() {
    if (!active) {
        active = true;

        requestAnimDictPromise("anim@mp_point")
            .then(() => {
                game.setPedCurrentWeaponVisible(player.scriptID, false, true, true, true);
                game.setPedConfigFlag(player.scriptID, 36, true);
                game.taskMoveNetworkByName(player.scriptID, "task_mp_pointing", 0.5, false, "anim@mp_point", 24);
                game.removeAnimDict("anim@mp_point");
                cleanStart = true;
                interval = alt.setInterval(process, 0);
            })
            .catch(() => {
                alt.log("Promise returned reject Pointing");
            });
    }
}

export function stop() {
    if (active) {
        if (interval) {
            alt.clearInterval(interval);
        }
        interval = null;

        active = false;

        if (cleanStart) {
            cleanStart = false;
            game.requestTaskMoveNetworkStateTransition(player.scriptID, "Stop");

            if (!game.isPedInjured(player.scriptID)) {
                game.clearPedSecondaryTask(player.scriptID);
            }
            if (!game.isPedInAnyVehicle(player.scriptID, true)) {
                game.setPedCurrentWeaponVisible(player.scriptID, true, true, true, true);
            }
            game.setPedConfigFlag(player.scriptID, 36, false);
            game.clearPedSecondaryTask(player.scriptID);
        }
    }
}

function getRelativePitch() {
    let camRot = game.getGameplayCamRot(2);
    return camRot.x - game.getEntityPitch(player.scriptID);
}

function process() {
    if (active) {
        game.isTaskMoveNetworkActive(player.scriptID);

        let camPitch = getRelativePitch();

        if (camPitch < -70.0) {
            camPitch = -70.0;
        } else if (camPitch > 42.0) {
            camPitch = 42.0;
        }
        camPitch = (camPitch + 70.0) / 112.0;

        let camHeading = game.getGameplayCamRelativeHeading();

        let cosCamHeading = Math.cos(camHeading);
        let sinCamHeading = Math.sin(camHeading);

        if (camHeading < -180.0) {
            camHeading = -180.0;
        } else if (camHeading > 180.0) {
            camHeading = 180.0;
        }
        camHeading = (camHeading + 180.0) / 360.0;

        let coords = game.getOffsetFromEntityInWorldCoords(
            player.scriptID,
            cosCamHeading * -0.2 - sinCamHeading * (0.4 * camHeading + 0.3),
            sinCamHeading * -0.2 + cosCamHeading * (0.4 * camHeading + 0.3),
            0.6
        );

        let ray = game.startShapeTestCapsule(coords.x, coords.y, coords.z - 0.2, coords.x, coords.y, coords.z + 0.2, 1.0, 95, player.scriptID, 7);
        let [_, blocked, coords1, coords2, entity] = game.getShapeTestResult(ray, false, null, null, null);
        //alt.log("Blocked: " + blocked);
        //alt.log("Entity: " + game.getEntityType(entity));

        game.setTaskMoveNetworkSignalFloat(player.scriptID, "Pitch", camPitch);
        game.setTaskMoveNetworkSignalFloat(player.scriptID, "Heading", camHeading * -1.0 + 1.0);
        //game.setTaskMoveNetworkSignalBool(localPlayer.scriptID, "isBlocked", blocked);
        //game.setTaskMoveNetworkSignalBool(localPlayer.scriptID, "isFirstPerson", game._0xEE778F8C7E1142E2(game._0x19CAFA3C87F7C2FF()) === 4);
    }
}

function requestAnimDictPromise(dict) {
    game.requestAnimDict(dict);
    return new Promise((resolve, reject) => {
        let check = alt.setInterval(() => {
            if (game.hasAnimDictLoaded(dict)) {
                alt.clearInterval(check);
                //alt.log('Anim dict loaded');
                resolve(true);
            } else {
                //alt.log('Requesting Animdict.');
            }
        }, 5);
    });
}
