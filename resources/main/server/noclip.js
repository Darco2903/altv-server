import alt from "alt-server";

alt.onClient("noclip:playerVisible", (player, bool) => {
    player.visible = !bool;
});

alt.onClient("noclip:request", (player) => {
    if (player.authorized(2)) {
        alt.emitClient(player, "noclip:toggle", true);
    }
});
