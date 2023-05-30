import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "getpos",
    description: "Get your current position",
    execute(player) {
        alt.emitClient(player, "command:getpos");
    },
});
