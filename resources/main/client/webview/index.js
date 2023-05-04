import * as alt from "alt-client";

import armory from "./armory.js";
import menu from "./menu.js";
import model from "./model.js";
import spawner from "./spawner.js";
import speedoForza from "./speedo-forza.js";
import tuner from "./tuner.js";

alt.on("resourceStop", () => {
    alt.Utils.toggleOnlyMove(false);
    alt.Utils.toggleTunerControls(false);
});

alt.on("keyup", (key) => {
    switch (key) {
        case 27: // ESC
            closeAll();
            break;

        case 75: // K
            if (!alt.Utils.isChatOpen()) {
                const state = menu.isVisible;
                if (!state) {
                    closeAll();
                }
                menu.toggle(!state);
            }
            break;
    }
});

function closeAll() {
    alt.WebView.all.forEach((view) => {
        if (view.isVisible && !view.isOverlay) {
            view.toggle(false);
        }
    });
}

export default {
    armory,
    menu,
    model,
    spawner,
    speedoForza,
    tuner,
};
