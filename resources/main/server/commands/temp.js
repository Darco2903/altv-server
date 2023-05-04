import * as alt from "alt-server";

// alt.Utils.registerCommand({
//     name: "audio",
//     description: "Play an audio file to a player.",
//     execute: (player) => {
//         alt.emitClient(player, "audio");
//     },
// });

alt.Utils.registerCommand({
    name: "track",
    description: "Create a track.",
    args: [
        {
            name: "name",
            description: "Name of the track.",
            required: true,
        },
    ],
    permissionLevel: 2,
    execute: (player, [name]) => {
        if (name) {
            alt.emitClient(player, "track:new", name);
        }
    },
});

alt.Utils.registerCommand({
    name: "addcheckpoint",
    description: "Add a checkpoint to the track.",
    permissionLevel: 2,
    execute: (player) => {
        alt.emitClient(player, "track:addCheckpoint");
    },
});
