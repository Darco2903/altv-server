import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "setop",
    description: "Set player op level",
    args: [
        {
            name: "player",
            description: "Player to set op level",
            type: "string",
            required: true,
        },
        {
            name: "opLevel",
            description: "Op level to set",
            type: "number",
            values: [0, 1, 2, 3, 4],
            required: true,
        },
    ],
    permissionLevel: 2,
    execute: (player, [playerName, opLevel]) => {
        const target = alt.Player.all.find((p) => p.name === playerName);
        if (!opLevel || opLevel > 4 || opLevel < 0) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                message: "Ce niveau d'opérateur n'existe pas.",
            });
        } else if (!player.hasPermission(opLevel + 1) || !player.hasPermission(target.getSyncedMeta("op") + 1)) {
            player.notAuthorized();
        } else if (!target) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                message: "Ce joueur n'existe pas.",
            });
        } else {
            target.setOpLevel(opLevel);
            player.sendNotification({
                imageName: "CHAR_MP_FM_CONTACT",
                headerMsg: "Opérateur",
                message: `${target.name} est maintenant opérateur niveau ${opLevel}`,
            });
        }
        return Promise.resolve();
    },
});
