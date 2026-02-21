import * as alt from "alt-server";

const globalChannel = new alt.VoiceChannel(true, 9999);
globalChannel.filter = alt.hash("walkietalkie");

alt.on("playerConnect", (player) => {
    globalChannel.addPlayer(player);
});

alt.on("playerDisconnect", (player) => {
    globalChannel.removePlayer(player);
});

// execute ./altv-voice-server.exe

// alt.on("resourceStart", () => {
//     alt.log("Voice chat started.");
// });

alt.on("resourceStart", () => {
    alt.Player.all.forEach((player) => {
        globalChannel.addPlayer(player);
    });
});

alt.on("resourceStop", () => {
    globalChannel.destroy();
});
