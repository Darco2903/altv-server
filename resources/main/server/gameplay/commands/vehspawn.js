import * as alt from "alt-server";

alt.Utils.Chat.registerCmd({
    name: "vehspawn",
    description: "Spawn a vehicle",
    args: [
        {
            name: "model",
            description: "Vehicle model",
            type: "string",
            required: true,
        },
    ],
    permissionLevel: 0,
    execute(player, [model]) {
        const rot = player.rot;
        const heading = rot.z;
        const forward = new alt.Vector3(Math.cos(heading), Math.sin(heading), 0);
        const pos = player.pos.add(forward.mul(3));
        const vehicle = alt.Vehicle.spawn(model, pos, rot);
    },
});
