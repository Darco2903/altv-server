import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "electronics",
    description: "Toggle electronics systems",
    args: [
        {
            name: "system",
            description: "System to toggle",
            type: "string",
            values: ["abs", "esc", "tc", "speedController", "all"],
            required: true,
        },
        {
            name: "state",
            description: "State to set",
            type: "string",
            values: ["on", "off"],
            required: true,
        },
    ],
    permissionLevel: 0,
    execute: (player, [subcommand, state]) => {
        switch (subcommand) {
            case "all":
                player.emit("electronics:abs:toggle", state === "on");
                player.emit("electronics:esc:toggle", state === "on");
                player.emit("electronics:tc:toggle", state === "on");
                player.emit("electronics:speedController:toggle", state === "on");
                break;

            case "abs":
            case "esc":
            case "tc":
                player.emit(`electronics:${subcommand}:toggle`, state === "on");
                break;

            default:
                player.sendNotification({
                    imageName: "CHAR_BLOCKED",
                    message: "Système inconnu.",
                });
                return Promise.reject();
        }

        player.sendNotification({
            imageName: "CHAR_CARSITE",
            headerMsg: "Electronics",
            detailsMsg: `Système ${subcommand} ${state === "on" ? "activé" : "désactivé"}.`,
            duration: 2,
        });

        return Promise.resolve();
    },
});
