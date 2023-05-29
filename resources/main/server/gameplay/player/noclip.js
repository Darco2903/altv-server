import * as alt from "alt-server";

alt.onClient("noclip:playerVisible", (player, state) => {
    player.visible = state;
    if (player.vehicle) {
        player.vehicle.visible = state;
    }
});
