import * as alt from "alt-client";
import * as native from "natives";

import armory from "./armory.js";
import model from "./model.js";
import * as nametag from "../nametag.js";
import spawner from "./spawner.js";
import trackEditor from "./trackEditor.js";
import tuner from "./tuner.js";

let player = alt.Player.local;

let view = new alt.WebView("http://resource/client/webview/menu/index.html");
view.isVisible = false;

view.on("event", async (id, state) => {
    switch (id) {
        case "spawner":
            view.toggle(false);
            spawner.toggle(true);
            break;

        case "tuner":
            view.toggle(false);
            tuner.toggle(true);
            break;

        case "register":
            alt.emitServer(`vehicle:${id}`, player.vehicle);
            const img = await takeScreenCar();
            await alt.Utils.waitFor(() => player.vehicle.hasSyncedMeta("id"), 2000);
            const modelName = native.getDisplayNameFromVehicleModel(player.vehicle.model);
            await img.resize(340);
            img.save(`${modelName}_${player.vehicle.getSyncedMeta("id")}`);
            updateWebview();
            alt.debug("saved");
            break;

        case "delete": {
            alt.emitServer(`vehicle:${id}`, player.vehicle);
            const modelName = native.getDisplayNameFromVehicleModel(player.vehicle.model);
            if (alt.Utils.Image.exists(`${modelName}_${player.vehicle.getSyncedMeta("id")}`)) {
                alt.Utils.Image.delete(`${modelName}_${player.vehicle.getSyncedMeta("id")}`);
            }
            await alt.Utils.waitFor(() => !player.vehicle.hasSyncedMeta("id"), 2000);
            updateWebview();
            alt.debug("deleted");
            break;
        }

        case "repair":
        case "despawn":
            alt.emitServer(`vehicle:${id}`, player.vehicle);
            view.toggle(false);
            break;

        case "model":
            view.toggle(false);
            model.toggle(true);
            break;

        case "armory":
            view.toggle(false);
            armory.toggle(true);
            break;

        case "trackEditor":
            view.toggle(false);
            trackEditor.toggle(true);
            break;

        case "nametag":
            nametag.display(state);
            break;
    }
});

function updateWebview() {
    view.emit("vehicle", !!player.vehicle, !!player.vehicle?.hasSyncedMeta("id"));
    view.emit("nametag", alt.getMeta("display:nametags"));
}

alt.on("enteredVehicle", updateWebview);
alt.on("leftVehicle", updateWebview);

view.toggle = function (state) {
    if (state && !view.isVisible) {
        updateWebview();
        view.centerPointer();
        alt.Utils.toggleOnlyMove(true);
        view.open();
    } else if (!state && view.isVisible) {
        alt.Utils.toggleOnlyMove(false);
        view.close();
    }
};

/**
 * @returns {Promise<alt.Utils.Image>}
 */
async function takeScreenCar() {
    const veh = player.vehicle;
    const calcPos = () => {
        const heading = veh.rot.z + 1.9; // ~ (11 / 18) * Math.PI
        const forward = new alt.Vector3(Math.cos(heading), Math.sin(heading), 0.1);
        return veh.pos.add(forward.mul(4));
    };
    let pos = calcPos();

    const cam = native.createCamWithParams("DEFAULT_SCRIPTED_CAMERA", pos.x, pos.y, pos.z, 0, 0, 0, 60, true, 0);
    native.pointCamAtEntity(cam, veh, 0, 0, 0, true);
    native.renderScriptCams(true, false, 0, true, false, 0);

    const tick = alt.everyTick(() => {
        pos = calcPos();
        native.setCamCoord(cam, pos.x, pos.y, pos.z);
    });

    await alt.Utils.waitFor(() => native.getCamCoord(cam).isInRange(pos, 0.1));

    const base64 = await alt.Utils.takeScreenshotNoHud();
    native.renderScriptCams(false, false, 0, false, false, 0);
    alt.clearEveryTick(tick);

    const img = new alt.Utils.Image(base64, "Image Test");

    return new Promise((resolve) => {
        img.onLoad = async () => {
            const screenRes = alt.getScreenResolution();
            const leftCropper = screenRes.div(10, 4).toFixed(0);
            const rightCropper = screenRes.div(4, 10).toFixed(0);
            await img.crop(leftCropper.x, leftCropper.y, rightCropper.x, rightCropper.y);
            resolve(img);
        };
    });
}

export default view;
