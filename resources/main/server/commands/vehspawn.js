import * as alt from "alt-server";
import * as chat from "../chat.js";

chat.register({
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
        const hash = alt.hash(model);
        // alt.emit("createVehicle", player, hash);
    },
});
