import * as alt from "alt-client";

const player = alt.Player.local;

const view = new alt.WebView("http://resource/client/gameplay/ui/vehiclespawner/browser/index.html");
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

function toggle(state) {
    if (state !== view.isVisible) {
        view.isVisible = state;
        if (alt.isCursorVisible() !== state) alt.showCursor(state);
        player.lockCamera(state);
        alt.emit("chat:enabled", !state);
        if (state) view.focus();
        else view.unfocus();
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
