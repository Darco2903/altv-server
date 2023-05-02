import * as alt from "alt-server";
import * as chat from "../chat.js";

chat.register({
    name: "cl",
    description: "Set specified clothing",
    args: [
        {
            name: "slot",
            description: "Clothing slot",
            required: true,
        },
        {
            name: "drawable",
            description: "Clothing drawable",
            required: false,
        },
        {
            name: "texture",
            description: "Clothing texture",
            required: false,
        },
        {
            name: "palette",
            description: "Clothing palette",
            required: false,
        },
    ],
    execute: (player, [slot, drawable, texture, palette]) => {
        if (slot) {
            player.setClothes(parseInt(slot), parseInt(drawable) || 0, parseInt(texture) || 0, parseInt(palette) || 0);
        } else {
            player.notify({
                imageName: "CHAR_BLOCKED",
                headerMsg: "Erreur",
                detailsMsg: "/cl",
                message: "Syntaxe invalide\n/cl [slot] [drawable] [texture] [palette]",
            });
        }
    },
});
