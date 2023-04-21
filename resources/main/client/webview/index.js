import * as alt from "alt-client";
import "./chat.js";
import { toggleMenu } from "./menu.js";

alt.on("keyup", (key) => {
    if (alt.isConsoleOpen() || (!alt.getMeta("controlsEnabled") && !webview.isVisible)) {
        return;
    }
    switch (key) {
        case 27: // ESC
            alt.emit("webview:close");
            break;
        case 75: // K
            toggleMenu();
            break;
    }
});
