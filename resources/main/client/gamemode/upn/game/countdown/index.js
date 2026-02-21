import * as alt from "alt-client";
import * as native from "natives";

let view;

alt.on("upn:countdown:init", () => {
    view = new alt.WebView("http://resource/client/gamemode/upn/game/countdown/browser/index.html");
});

alt.on("upn:countdown:run", () => {
    view.emit("countdown:run");
});

alt.onServer("upn:countdown:start", async () => {
    alt.emit("upn:countdown:run");
    for (let i = 0; i < 4; i++) {
        const soundId = native.getSoundId();
        native.playSoundFrontend(soundId, "3_2_1", "HUD_MINI_GAME_SOUNDSET", 0);
        await alt.Utils.wait(1000);
        alt.Utils.waitFor(() => native.hasSoundFinished(soundId), 2000).then(() => {
            native.releaseSoundId(soundId);
        });
    }
});
