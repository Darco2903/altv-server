import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "kick",
    description: "Kick a player from the server.",
    args: [
        {
            name: "player",
            type: "player",
            required: true,
        },
        {
            name: "reason",
            type: "string",
            required: false,
        },
    ],
    permissionLevel: 3,
    execute: (player, [playerName, reason]) => {
        const toKick = alt.Player.all.find((p) => p.name === playerName);
        if (!toKick) return alt.log("Player not found.");
        toKick.kick(reason);
    },
});
