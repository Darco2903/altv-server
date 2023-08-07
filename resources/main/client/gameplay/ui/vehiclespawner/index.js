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

// view.on("spawnVehicle", (model) => {
//     const hash = alt.hash(model);
//     if (!player.vehicle) {
//         alt.emitServer("vehicle:createPlayersIn", hash, [player]);
//     } else if (notSameVeh(hash, null)) {
//         alt.emitServer("vehicle:replace", player.vehicle, hash);
//     }
//     toggle(false);
// });

view.on("spawn:vehicle", async (model) => {
    try {
        const hash = alt.hash(model);
        if (!player.vehicle) {
            alt.emitServer("vehicle:spawn", hash, player.pos, player.rot, { engineOn: false, passengers: [player] });
        } else {
            if (player.seat !== 1) return;
            alt.emitServer("vehicle:replace", player.vehicle, hash);
        }
        // await alt.Utils.waitFor(() => player.vehicle?.model === hash, 1000);
        // toggle(false);
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

// alt.on("ui:toggle:spawner", async (state) => {
//     if (state && !view.isVisible) {
//         alt.Utils.toggleOnlyMove(true);
//         view.open();
//         try {
//             const garage = await getPlayerGarage();
//             if (garage !== playerGarage) {
//                 playerGarage = garage;
//                 view.emit("garageList", garage);
//             }
//         } catch (error) {
//             alt.logError(error);
//         }
//     } else if (!state && view.isVisible) {
//         view.close();
//         alt.Utils.toggleOnlyMove(false);
//     }
// });

function toggle(state) {
    if (state !== view.isVisible) {
        view.isVisible = state;
        if (alt.isCursorVisible() !== state) alt.showCursor(state);
        player.lockCamera(state);
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

alt.on("keyup", (key) => {
    if (key === 27 && view.isVisible && alt.gameControlsEnabled()) {
        // Escape
        toggle(false);
    }
});
