import * as alt from "alt-server";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const locations = require("../../../../data-pack/content/locations.json");

alt.Utils.Chat.registerCmd({
    name: "goto",
    args: [
        {
            name: "location",
            description: "Name of the location",
            type: "location",
            required: true,
        },
    ],
    description: "Teleport to the specified location",
    permissionLevel: 1,
    execute(player, [locationName]) {
        if (!locationName || locationName === "help" || locationName === "h") {
            player.sendNotification({
                imageName: "CHAR_MP_FM_CONTACT",
                headerMsg: "/goto",
                message: "/goto [locationName]",
                duration: 5,
            });
            return;
        }
        if (!Object.hasOwn(locations, locationName)) {
            player.sendNotification({
                imageName: "CHAR_MP_FM_CONTACT",
                headerMsg: "/goto",
                message: "Unknow location",
                duration: 5,
            });
        }
        player.pos = new alt.Vector3(locations[locationName]);
    },
});

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
    permissionLevel: 1,
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
