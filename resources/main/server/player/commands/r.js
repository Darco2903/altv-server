import * as alt from "alt-server";
import * as chat from "../../chat/index.js";

chat.registerCmd("r", (player, [resourceName]) => {
    if (Functions.authorized(player, 4)) {
        if (resourceName) {
            alt.restartResource(resourceName);
        } else {
            alt.stopServer();
        }
    }
});
