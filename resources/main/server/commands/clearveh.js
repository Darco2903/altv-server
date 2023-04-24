import * as alt from "alt-server";
import * as chat from "../chat.js";

chat.register({
    name: "clearveh",
    description: "Clear all vehicles",
    args: [],
    execute: (player) => {
        const usedVehicle = alt.Player.all.filter((player) => player.vehicle).map((player) => player.vehicle);
        if (player.authorized(2)) {
            alt.Vehicle.all.forEach((veh) => {
                if (!veh.hasSyncedMeta("id") && !usedVehicle.includes(veh)) {
                    veh.destroy();
                }
            });
            player.notify({
                imageName: "CHAR_MP_FM_CONTACT",
                headerMsg: "Vehicles cleared",
                detailsMsg: "/clearveh",
                message: "All vehicles have been cleared",
            });
        } else {
            player.notAuthorized();
        }
    },
});
