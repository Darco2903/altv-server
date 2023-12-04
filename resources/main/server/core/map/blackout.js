import * as alt from "alt-server";

const META_KEY = "blackout";

alt.Utils.blackout = function (state) {
    if (alt.getSyncedMeta(META_KEY) === state) return;
    alt.setSyncedMeta(META_KEY, state);
};

alt.on("serverStarted", () => {
    alt.setSyncedMeta(META_KEY, false);
});

alt.Utils.Chat.registerCmd({
    name: "blackout",
    description: "Set the blackout",
    permissionLevel: 2,
    args: [
        {
            name: "value",
            description: "The blackout value",
            required: true,
            values: ["true", "false"],
        },
    ],
    execute(player, [value]) {
        switch (value) {
            case "true":
            case "false":
                break;
            default:
                player.sendMsg("{f80}Utilisation: /blackout [true/false]");
                return;
        }
        alt.Utils.blackout(value === "true");
        player.sendNotification({
            imageName: "CHAR_DEFAULT",
            headerMsg: "Blackout",
            message: `Blackout ${value === "true" ? "activé" : "désactivé"}`,
            duration: 3,
        });
    },
});
