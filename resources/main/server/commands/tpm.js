import * as alt from "alt-server";


alt.Utils.registerCommand({
    name: "tpm",
    description: "Go to map waypoint",
    args: [],
    execute: (player) => {
        alt.emitClient(player, "tpm");
    },
});
