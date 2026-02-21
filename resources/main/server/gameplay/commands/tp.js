import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "tp",
    description: "Teleport to player",
    args: [
        {
            name: "player1",
            description: "Player to teleport to",
            type: "player",
            required: true,
        },
        {
            name: "player2",
            description: "Player to teleport to",
            type: "player",
            required: false,
        },
    ],
    permissionLevel: 1,
    execute: (player, [playerName1, playerName2]) => {
        if (playerName2 && !player.hasPermission(3)) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Non autorisé",
                message: "Vous ne pouvez pas téléporter un joueur vers un autre joueur.",
            });
        }
        if (!playerName1) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                message: "Vous devez spécifier un joueur.",
            });
            return;
        }
        const toName = playerName2 ?? playerName1;
        const toPlayer = alt.Player.all.find((p) => p.name === toName);
        if (!toPlayer) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                message: "Ce joueur n'existe pas.1",
            });
            return;
        }

        let targetPlayer;
        if (playerName2) {
            targetPlayer = alt.Player.all.find((p) => p.name === playerName1);
            if (!targetPlayer) {
                player.sendNotification({
                    imageName: "CHAR_BLOCKED",
                    headerMsg: "Erreur",
                    message: "Ce joueur n'existe pas.2",
                });
                return;
            }
        } else {
            targetPlayer = player;
        }
        targetPlayer.pos = toPlayer.pos;
    },
});

alt.Utils.Chat.registerCmd({
    name: "tpm",
    description: "Teleport to waypoint",
    permissionLevel: 1,
    execute(player) {
        alt.emitClient(player, "command:tpm");
    },
});
