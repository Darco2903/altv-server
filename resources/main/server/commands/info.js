import * as alt from "alt-server";
import * as chat from "../chat.js";

chat.register({
    name: "info",
    description: "Affiche les informations du joueur",
    args: [],
    execute: (player, []) => {
        alt.log(`Nom: ${player.name} ID: ${player.getSyncedMeta("id")} OP: ${player.getMeta("op")}`);
        player.notify({
            imageName: "CHAR_MP_FM_CONTACT",
            headerMsg: `Infos`,
            detailsMsg: player.name,
            message: `ID: ${player.getSyncedMeta("id")}\nOP: ${player.getMeta("op")}`,
        });
    },
});
