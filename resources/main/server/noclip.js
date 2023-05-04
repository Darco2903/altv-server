import * as alt from "alt-server";

alt.onClient("noclip:playerVisible", (player, bool) => {
    player.visible = !bool;
});
