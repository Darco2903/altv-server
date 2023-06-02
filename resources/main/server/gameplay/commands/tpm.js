import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "tpm",
    description: "Teleport to waypoint",
    execute(player) {
        alt.emitClient(player, "command:tpm");
    },
});
