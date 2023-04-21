import * as alt from "alt-server";
import * as chat from "../chat.js";

chat.register({
    name: "repair",
    description: "Repair your vehicle or the nearest one",
    args: [],
    execute: (player) => {
        const vehicle = player.vehicle ?? alt.getClosestEntities(player.pos, 40, player.dimension, 1, alt.BaseObjectType.Vehicle)[0];
        if (vehicle?.valid) {
            vehicle.repair();
            player.notify({
                imageName: "CHAR_CARSITE",
                headerMsg: "Réparation",
                detailsMsg: vehicle.model,
                message: "Votre véhicule a été réparé",
            });
        } else {
            player.notify({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: "/repair",
                message: "Aucun véhicule trouvé",
            });
        }
    },
});
