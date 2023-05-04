import * as alt from "alt-client";
import * as native from "natives";
import * as pointing from "./fingerpointing.js";

const player = alt.Player.local;

if (!alt.Player.local.isSpawned) {
    native.doScreenFadeOut(1000);
}

alt.once("connectionComplete", () => {
    alt.log("connectionComplete");
    native.doScreenFadeOut(0);
});

alt.once("spawned", async () => {
    await alt.Utils.wait(2000);
    native.doScreenFadeIn(1500);
});

alt.onServer("player:tp", player.tp);
alt.onServer("notification", player.notify);

alt.onServer("tpm", () => {
    player.tp(alt.Utils.getWaypointPos());
});

alt.on("keydown", (key) => {
    switch (key) {
        case 66: // alt.KeyCode.B;
            pointing.start();
            break;

        case 192: // alt.KeyCode["`"]; key = ù
            native.setPedToRagdoll(player, 1000, 0, 0, false, false, false);
            break;
    }
});

alt.on("keyup", (key) => {
    switch (key) {
        case 66: // alt.KeyCode.B;
            pointing.stop();
            break;
    }
});

//  native.taskJump(player, false, true, false)
//  native.taskHandsUp(player, 5000, -1, -1, -1)
//  let ped = native.clonePed(player, false, false, false)
//  native.setEnableHandcuffs(ped, true)

//  setTimeout(() => {
//      native.setEnableHandcuffs(player, true)
//      native.taskArrestPed(player, ped)
//  }, 100);

//  native.setPlayerMaxArmour(player, 100)
