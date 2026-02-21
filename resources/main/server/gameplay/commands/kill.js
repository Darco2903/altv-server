import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "kill",
    description: "Kill a player.",
    args: [
        {
            name: "player",
            type: "player",
            required: false,
        },
    ],
    permissionLevel: 3,
    execute: (player, [playerName]) => {
        const toKill = playerName ? alt.Player.all.find((p) => p.name === playerName) : player;
        if (!toKill) return alt.log("Player not found.");
        toKill.health = 0;
    },
});
