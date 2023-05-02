import * as alt from "alt-server";
import * as chat from "../chat.js";

chat.register({
    name: "respawn",
    description: "Respawn",
    args: [],
    execute: (player) => {
        const veh = player.vehicle;
        player.respawn();
        if (veh) {
            player.setIntoVehicle(veh, 1);
        }
    },
});
