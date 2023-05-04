import * as alt from "alt-server";

import * as vehicle from "../vehicles.js";

alt.Utils.registerCommand({
    name: "vehspawn",
    description: "Spawn a vehicle",
    args: [
        {
            name: "model",
            description: "Vehicle model",
            type: "string",
        },
    ],
    execute: (player, [model]) => {
        if (!model) {
            player.notify({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: "/vehspawn",
                message: "Vous devez spécifier un model.\n/vehspawn [model]",
            });
        }
        try {
            const hash = alt.hash(model);
            vehicle.create(hash, player.pos.add(2, 2, 0), player.rot);
            // vehicle.createPlayerIn(hash, player);
        } catch (error) {
            alt.logError(`[COMMAND] /vehspawn ${model} ${error}`);
            player.notify({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: `/vehspawn ${model}`,
                message: `Modèle inconnu: ${model}`,
            });
        }
    },
});
