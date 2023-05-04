import * as alt from "alt-server";

alt.Utils.registerCommand({
    name: "clearveh",
    description: "Clear all vehicles",
    args: [],
    permissionLevel: 2,
    execute: (player) => {
        const usedVehicle = alt.Player.all.filter((player) => player.vehicle).map((player) => player.vehicle);

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
    },
});
