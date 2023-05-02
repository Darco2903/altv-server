import * as alt from "alt-server";
import * as chat from "../chat.js";

chat.register({
    name: "tpm",
    description: "Go to map waypoint",
    args: [],
    execute: (player) => {
        alt.emitClient(player, "tpm");
    },
});
