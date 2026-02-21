import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "heal",
    description: "Heal yourself",
    args: [
        {
            name: "player",
            description: "Player to heal",
            type: "player",
            required: false,
        },
    ],
    permissionLevel: 1,
    execute: (player, [playerName]) => {
        if (playerName && !player.hasPermission(3)) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Non autorisé",
                message: "Vous ne pouvez pas soigner un autre joueur.",
            });
            return;
        }
        let playerToHeal;
        if (playerName) {
            playerToHeal = alt.Player.all.find((p) => p.name === playerName);
            if (!playerToHeal) {
                player.sendNotification({
                    imageName: "CHAR_BLOCKED",
                    headerMsg: "Erreur",
                    message: "Joueur introuvable.",
                });
                return;
            }
        } else {
            playerToHeal = player;
        }
        playerToHeal.health = 200;
        // playerToHeal.sendNotification({
        //     imageName: "CHAR_CARSITE",
        //     headerMsg: "heal",
        //     message: "Vous avez été soigné",
        //     duration: 3,
        // });
    },
});
