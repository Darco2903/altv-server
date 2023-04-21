import * as alt from "alt-server";
import { register } from "../chat.js";

register({
    name: "r",
    description: "Restart server or resource",
    args: [
        {
            name: "resourceName",
            type: "string",
            optional: true,
        },
    ],
    execute: (player, [resourceName]) => {
        if (!player.authorized(4)) {
            player.notAuthorized();
            return;
        }

        if (!resourceName) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: "/r [resourceName]",
                message: "Vous devez spécifier le nom de la ressource à redémarrer.",
            });
        }

        if (alt.hasResource(resourceName)) {
            player.sendNotification({
                imageName: "CHAR_MP_FM_CONTACT",
                headerMsg: `Restarting ${resourceName}`,
            });
            alt.restartResource(resourceName);
        } else {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: `/${resourceName}`,
                message: "Cette ressource n'existe pas.",
            });
        }
    },
});
