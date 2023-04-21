import * as alt from "alt-client";
import * as chat from "./chat.js";
import * as menu from "./menu.js";
import * as spawner from "./spawner.js";
import * as tuner from "./tuner.js";

alt.on("keyup", (key) => {
    if (alt.isConsoleOpen() || (!alt.getMeta("controlsEnabled") && !webview.isVisible)) {
        return;
    }

    switch (key) {
        case 27: // ESC
            alt.emit("webview:closeAll");
            alt.toggleGameControls(true);
            alt.Utils.toggleOnlyVehMove(false);
            alt.Utils.toggleTunerControls(false);
            break;

        case 75: // K
            menu.toggle();
            break;
    }
});

export default {
    chat,
    menu,
    spawner,
    tuner,
};
