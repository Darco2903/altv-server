import * as alt from "alt-client";
import * as chat from "./chat.js";
import * as menu from "./menu.js";
import * as spawner from "./spawner.js";
import * as tuner from "./tuner.js";

alt.on("keyup", (key) => {
    switch (key) {
        case 27: // ESC
            alt.emit("webview:closeAll");
            chat.enable(true);
            break;

        case 75: // K
            if (chat.isOpen()) return;
            const state = menu.isVisible();
            alt.emit("webview:closeAll");
            menu.toggle(!state);
            break;
    }
});

export default {
    chat,
    menu,
    spawner,
    tuner,
};
