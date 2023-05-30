import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "clearveh",
    description: "Clear vehicles",
    permissionLevel: 2,
    execute: (player) => {
        alt.Vehicle.clear();
        player.sendNotification({
            imageName: "CHAR_CARSITE",
            headerMsg: "clearvehall",
            message: "Les véhicules non utilisés ont été supprimés",
            duration: 3,
        });
    },
});

alt.Utils.Chat.registerCmd({
    name: "clearvehall",
    description: "Clear all vehicles",
    permissionLevel: 4,
    execute: (player) => {
        alt.Vehicle.clearAll();
        player.sendNotification({
            imageName: "CHAR_CARSITE",
            headerMsg: "clearvehall",
            message: "Tous les véhicules ont été supprimés",
            duration: 3,
        });
    },
});
