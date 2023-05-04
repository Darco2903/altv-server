import * as alt from "alt-server";
import locationsList from "../../shared/data/locations.json" assert { type: "json" };

alt.Utils.registerCommand({
    name: "goto",
    description: "Go to specified location",
    args: [
        {
            name: "location",
            description: "Location name or coordinates",
            required: true,
        },
    ],
    execute: (player, [nameOrX, y = 0, z = 0]) => {
        if (!nameOrX || (y && isNaN(y)) || (z && isNaN(z))) {
            player.notify({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: "/goto",
                message: "Syntaxe invalide\n/goto [nomDuLieu] ou [x, y, z]\n/goto list pour afficher la liste des lieux",
            });
            return;
        }

        if (nameOrX === "list") {
            player.notify({
                imageName: "CHAR_DEFAULT",
                headerMsg: "Liste des lieux",
                detailsMsg: "/goto",
                message: Object.keys(locationsList).join("\n"),
            });
            return;
        }

        let pos;
        if (isNaN(nameOrX)) {
            pos = locationsList[nameOrX];
            if (!pos) {
                player.notify({
                    imageName: "CHAR_BLOCKED",
                    headerMsg: "Erreur",
                    detailsMsg: "/goto",
                    message: `Aucun lieu trouvé avec le nom ${nameOrX}`,
                });
                return;
            }
        } else {
            pos = [nameOrX, y, z].map((value) => parseFloat(value));
        }

        alt.emitClient(player, "player:tp", new alt.Vector3(pos));
        //player.spawn(new alt.Vector3(pos))
    },
});
