import * as alt from "alt-server";
import * as chat from "../chat.js";

chat.register({
    name: "clearveh",
    description: "Clear all vehicles",
    args: [],
    execute: (player) => {
        alt.Vehicle.all.forEach((veh) => veh.destroy());
        chat.send(player, "cleared");
    },
});
