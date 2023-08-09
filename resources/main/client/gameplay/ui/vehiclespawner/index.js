import * as alt from "alt-client";
// import * as native from "natives";

const player = alt.Player.local;
// let playerGarage;

// function notSameVeh(model, id) {
//     return (
//         (!player.vehicle.hasSyncedMeta("id") && player.vehicle.model != model) ||
//         (player.vehicle.hasSyncedMeta("id") && player.vehicle.getSyncedMeta("id") != id)
//     );
// }

let view = new alt.WebView("http://resource/client/gameplay/ui/vehiclespawner/index.html");
view.isVisible = false;

view.on("spawn:vehicle", async (model) => {
    try {
        const hash = alt.hash(model);
        if (!player.vehicle) {
            alt.emitServer("vehicle:spawn", hash, player.pos, player.rot, { engineOn: false, passengers: [player] });
        } else if (player.seat === 1) {
            alt.emitServer("vehicle:replace", player.vehicle, hash);
        } else {
            player.sendNotification({
                imageName: "CHAR_CARSITE",
                headerMsg: "Concessionnaire",
                message: "Vous devez être au volant pour modifier le véhicule",
            });
        }
    } catch (error) {
        alt.logError(`Failed to spawn ${model}`);
    }
});

view.on("search:start", () => {
    alt.toggleGameControls(false);
});

view.on("search:end", () => {
    alt.toggleGameControls(true);
});

// view.on("spawnSavedVehicle", (id) => {
//     if (!player.vehicle) {
//         alt.emitServer("vehicle:importSaved", id, [player]);
//     } else if (notSameVeh(null, id)) {
//         alt.emitServer("vehicle:importSavedReplace", player.vehicle, id);
//     }
//     view.toggle(false);
// });

// async function getPlayerGarage() {
//     alt.emitServer("getPlayerVehicles");
//     return new Promise((resolve) => {
//         const timeout = alt.setTimeout(() => {
//             reject("getPlayerGarage: response took too long");
//         }, 5000);
//         alt.onceServer("playerGarage", (res) => {
//             for (let i = 0; i < res.length; i++) {
//                 const imageKey = `${modelName}_${res[i].id}`;
//                 if (modelName === "CARNOTFOUND") {
//                     res.splice(i, 1);
//                     i--;
//                 } else if (alt.Utils.Image.exists(imageKey)) {
//                     res[i].image = alt.Utils.Image.load(imageKey).getSource();
//                 }
//             }
//             alt.clearTimeout(timeout);
//             resolve(res);
//         });
//     });
// }

// view.on("takeScreenCar", async () => {
//     const img = await takeScreenCar();
//     view.emit("takeScreenCar", img.getSource());
// });

function toggle(state) {
    if (state !== view.isVisible) {
        view.isVisible = state;
        if (alt.isCursorVisible() !== state) alt.showCursor(state);
        player.lockCamera(state);
        alt.emit("chat:enabled", !state);
        if (state) {
            view.focus();
        } else {
            view.unfocus();
        }
    }
}

alt.on("menu:option:open", (id) => {
    if (id === "vehiclespawner") {
        toggle(true);
    }
});

alt.on("ui:close:all", () => {
    toggle(false);
});

alt.on("keyup", (key) => {
    if (key === 27 && view.isVisible && alt.gameControlsEnabled()) {
        // Escape
        toggle(false);
    }
});
