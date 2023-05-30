import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "gotocoords",
    args: [
        {
            name: "x",
            description: "X coordinate",
            type: "number",
            required: true,
        },
        {
            name: "y",
            description: "Y coordinate",
            type: "number",
            required: true,
        },
        {
            name: "z",
            description: "Z coordinate",
            type: "number",
            required: true,
        },
    ],
    description: "Teleport to coordinates",
    execute(player, [x, y, z]) {
        if (!x || x === "help" || x === "h" || x === "?") {
            player.sendNotification({
                imageName: "CHAR_MP_FM_CONTACT",
                headerMsg: "/gotocoords",
                message: "/gotocoords [x] [y] [z]\n/gotocoords [x,y,z]",
                duration: 6,
            });
            return;
        }

        if (x.includes(",")) {
            [x, y, z] = x.split(",");
        }

        x = parseFloat(x);
        y = parseFloat(y);
        z = parseFloat(z);

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "/gotocoords",
                message: "Les coordonnées sont invalides.",
            });
        }

        player.pos = new alt.Vector3(x, y, z);
    },
});

alt.Utils.Chat.registerCmd({
    name: "livery",
    args: [
        {
            name: "livery",
            description: "Livery ID",
            type: "number",
            required: true,
        },
    ],
    description: "Change vehicle livery",
    execute(player, [livery]) {
        if (!player.vehicle) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "/livery",
                message: "Vous devez être dans un véhicule.",
            });
            return;
        }

        if (isNaN(livery)) {
            player.sendNotification({
                imageName: "CHAR_BLOCKED",
                headerMsg: "/livery",
                message: "L'ID de la livrée est invalide.",
            });
            return;
        }

        player.vehicle.livery = livery;
    },
});
