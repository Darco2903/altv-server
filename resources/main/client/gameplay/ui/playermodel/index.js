import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let view = new alt.WebView("http://resource/client/gameplay/ui/playermodel/index.html");
view.isVisible = false;

view.on("model:player", async (model) => {
    const hash = alt.hash(model);
    if (player.model === hash) return;
    alt.emitServer("playermodel:set", hash);
    await alt.Utils.waitFor(() => player.model === hash, 1000);
    await new Promise((resolve) => alt.nextTick(resolve));
    native.setGameplayCamRelativeHeading(180);
    if (!player.vehicle) {
        native.startPlayerTeleport(player, player.pos.x, player.pos.y, player.pos.z + 1, 180, true, true, true);
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
        if (state) {
            view.focus();
        } else {
            view.unfocus();
        }
    }
}

alt.on("menu:option:open", (id) => {
    if (id === "playermodel") {
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
