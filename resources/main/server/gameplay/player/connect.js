import * as alt from "alt-server";

alt.on("playerConnect", (player) => {
    alt.log(`~b~${player.name} ~g~(${player.socialID}) ~y~connecting...`);
    player.spawn("mp_m_freemode_01", new alt.Vector3([180, -1030, 28]));
    player.setDateTime(0, 0, 0, 10, 0, 0);
    player.setSyncedMeta("op", 4);
});

alt.on("playerDisconnect", (player) => {
    alt.log(`~b~${player.name} ~g~(${player.socialID}) ~r~disconnected`);
});
