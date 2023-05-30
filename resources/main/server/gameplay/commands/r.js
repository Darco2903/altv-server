import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "r",
    description: "Restart server or resource",
    args: [
        {
            name: "resourceName",
            description: "Name of the resource to restart",
            type: "string",
            values: alt.Resource.all.map((r) => r.name),
            required: false,
        },
    ],
    permissionLevel: 4,
    execute: (player, [resourceName = "main"]) => {
        if (alt.hasResource(resourceName)) {
            player.sendNotification({
                imageName: "CHAR_MP_FM_CONTACT",
                headerMsg: `Restarting ${resourceName}...`,
                duration: 3,
            });
            alt.restartResource(resourceName);
        } else {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: `/${resourceName}`,
                message: "Cette ressource n'existe pas.",
                duration: 3,
            });
        }
        return Promise.resolve();
    },
});
