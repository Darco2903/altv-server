import * as alt from "alt-server";

alt.Utils.registerCommand({
    name: "respawn",
    description: "Respawn",
    args: [],
    execute: (player) => {
        const veh = player.vehicle;
        player.spawn(player.pos);
        if (veh) {
            player.setIntoVehicle(veh, 1);
        }
    },
});
