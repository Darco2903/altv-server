import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "clearvehall",
    description: "Clear all vehicles",
    permissionLevel: 4,
    execute: (player) => {
        alt.Vehicle.clearAll();
        player.sendNotification({
            imageName: "CHAR_CARSITE",
            headerMsg: "clearvehall",
            message: "All vehicles have been cleared",
            duration: 3,
        });
    },
});
