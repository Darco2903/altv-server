import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "getpos",
    description: "Get your current position",
    execute(player) {
        alt.emitClient(player, "command:getpos");
    },
});

alt.Utils.Chat.registerCmd({
    name: "getrot",
    description: "Get your current rotation",
    execute(player) {
        alt.emitClient(player, "command:getrot");
    },
});

alt.Utils.Chat.registerCmd({
    name: "getposrot",
    description: "Get your current position and rotation",
    execute(player) {
        alt.emitClient(player, "command:getposrot");
    },
});
