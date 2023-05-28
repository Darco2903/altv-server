import * as alt from "alt-server";

alt.on("playerConnect", (player) => {
    alt.log(`~b~${player.name} ~g~(${player.socialID}) ~y~connecting...`);
    player.spawn(0, 5, 71);
    player.model = "mp_m_freemode_01";
    player.setDateTime(0, 0, 0, 10, 0, 0);
    player.setSyncedMeta("op", 4);
});

alt.on("playerDisconnect", (player) => {
    alt.log(`~b~${player.name} ~g~(${player.socialID}) ~r~disconnected`);
});
