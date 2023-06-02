import * as alt from "alt-client";
import * as native from "natives";

const ragdolKey = 192; // ù alt.KeyCode["`"]

const player = alt.Player.local;
let interval;
alt.on("keydown", async (key) => {
    if (key === ragdolKey) {
        while (alt.isKeyDown(ragdolKey)) {
            native.setPedToRagdoll(player, 2000, 0, 0, false, false, false);
            await alt.Utils.wait(100);
        }
    }
});
