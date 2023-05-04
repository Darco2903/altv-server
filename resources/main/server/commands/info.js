import * as alt from "alt-server";

alt.Utils.registerCommand({
    name: "info",
    description: "Affiche les informations du joueur",
    args: [],
    execute: (player, []) => {
        alt.log(`Nom: ${player.name} ID: ${player.getSyncedMeta("id")} OP: ${player.getSyncedMeta("op")}`);
        player.notify({
            imageName: "CHAR_MP_FM_CONTACT",
            headerMsg: `Infos`,
            detailsMsg: player.name,
            message: `ID: ${player.getSyncedMeta("id")}\nOP: ${player.getSyncedMeta("op")}`,
        });
    },
});

alt.Utils.registerCommand({
    name: "getpos",
    description: "Affiche la position du joueur",
    args: [],
    execute: (player, []) => {
        alt.log(`Position: ${player.pos}`);
        const pos = player.pos.toFixed(2);
        player.notify({
            imageName: "CHAR_MP_FM_CONTACT",
            headerMsg: `Position`,
            detailsMsg: player.name,
            message: `Position:\nx: ~y~${pos.x}\n~w~y: ~y~${pos.y}\n~w~z: ~y~${pos.z}`,
        });
    },
});
