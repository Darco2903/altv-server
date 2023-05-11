import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let view = new alt.WebView("http://resource/client/webview/spawner/index.html", false);
view.isVisible = false;

view.on("spawnVehicle", (model) => {
    const hash = alt.hash(model);
    if (!player.vehicle) {
        alt.emitServer("vehicle:createPlayersIn", hash, [player]);
    } else if (notSameVeh(hash, null)) {
        alt.emitServer("vehicle:replace", player.vehicle, hash);
    }
    view.toggle(false);
});

view.on("spawnSavedVehicle", (id) => {
    if (!player.vehicle) {
        alt.emitServer("vehicle:importSaved", id, [player]);
    } else if (notSameVeh(null, id)) {
        alt.emitServer("vehicle:importSavedReplace", player.vehicle, id);
    }
    view.toggle(false);
});

view.toggle = function (state) {
    if (state && !view.isVisible) {
        alt.Utils.toggleOnlyMove(true);
        view.open();
        alt.emitServer("getPlayerVehicles");
    } else if (!state && view.isVisible) {
        view.close();
        alt.Utils.toggleOnlyMove(false);
    }
};

function notSameVeh(model, id) {
    return (
        (!player.vehicle.hasSyncedMeta("id") && player.vehicle.model != model) ||
        (player.vehicle.hasSyncedMeta("id") && player.vehicle.getSyncedMeta("id") != id)
    );
}

alt.onServer("playerGarage", async (res) => {
    for (const [key, { id, model }] of Object.entries(res)) {
        const modelName = native.getDisplayNameFromVehicleModel(alt.hash(model));
        const imageKey = `${modelName}_${id}`;
        if (alt.Utils.Image.exists(imageKey)) {
            const src = (await alt.Utils.Image.load(imageKey)).getSource();
            res[key] = Object.assign(res[key], { image: src });
        }
    }
    view.emit("garageList", res);
});

view.on("takeScreenCar", async () => {
    const img = await takeScreenCar();
    view.emit("takeScreenCar", img.getSource());
});

export default view;
