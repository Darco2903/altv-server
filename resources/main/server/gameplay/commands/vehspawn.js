import * as alt from "alt-server";
// import vehicles from "../../../../data/vehicles.json" assert { type: "json" };
// import vehiclesMod from "../../../../data/vehiclesMod.json" assert { type: "json" };

alt.Utils.Chat.registerCmd({
    name: "vehspawn",
    description: "Spawn a vehicle",
    args: [
        {
            name: "model",
            description: "Vehicle model",
            type: "string",
            // values: vehicles
            //     .concat(vehiclesMod)
            //     .map((v) => v.Name)
            //     .sort((a, b) => a.localeCompare(b)),
            required: true,
        },
    ],
    permissionLevel: 0,
    execute(player, [model]) {
        const pos = player.pos.add(0, -2, 0);
        const vehicle = alt.Vehicle.spawn(model, pos);
        player.setIntoVehicle(vehicle, 1);
    },
});
