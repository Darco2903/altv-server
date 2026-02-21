import * as alt from "alt-client";
import * as native from "natives";
import { toggleHiderControls, initHider, stopHider } from "./hider.js";
import { toggleHunterControls } from "./hunter.js";

const player = alt.Player.local;
let controlTick;

// function savePlayer() {
//     alt.setMeta("player:back:pos", player.pos);
//     alt.setMeta("player:back:vehicle", player.vehicle);
//     alt.setMeta("player:back:seat", player.seat - 2);
// }

// function restorePlayer() {
//     const pos = alt.getMeta("player:back:pos");
//     const vehicle = alt.getMeta("player:back:vehicle");
//     const seat = alt.getMeta("player:back:seat");
//     alt.deleteMeta("player:back:pos");
//     alt.deleteMeta("player:back:vehicle");
//     alt.deleteMeta("player:back:seat");
//     if (pos) {
//         player.pos = pos;
//         if (vehicle) {
//             native.setPedIntoVehicle(player, vehicle, seat);
//         }
//     }
// }

alt.onServer("guesswho:game:init", async () => {
    alt.once("resourceStop", onResourceStop);
    await alt.Utils.screenFadeOut(500);
    alt.emit("player:revive");
    // savePlayer();
    alt.setMeta("menu:enabled", false);
    alt.setMeta("noclip:enabled", false);
    alt.setMeta("respawn:enabled", false);
    alt.Player.displayNametags(false);
    player.pos = new alt.Vector3(877.23, 40.66, 143.8);
    native.freezeEntityPosition(player, true);
    native.setEntityHeading(player, 265);
    native.setGameplayCamRelativeHeading(0);
    native.setGameplayCamRelativePitch(-36, 1);
    controlTick = alt.everyTick(() => {
        native.disableAllControlActions(0);
        native.hideHudAndRadarThisFrame();
        alt.Player.all.forEach((p) => {
            native.setEntityVisible(p, false, false);
            native.setEntityCollision(p, false, false);
        });
    });
    await alt.Utils.wait(500);
    native.triggerScreenblurFadeIn(500);
    await alt.Utils.screenFadeIn(500);
});

alt.onServer("guesswho:game:start", async (pos) => {
    await alt.Utils.screenFadeOut(500);
    native.triggerScreenblurFadeOut(0);
    player.pos = pos;
    if (controlTick) {
        alt.clearEveryTick(controlTick);
        controlTick = null;
    }
    alt.Player.all.forEach((p) => {
        native.setEntityVisible(p, true, false);
        native.setEntityCollision(p, true, true);
    });
    const team = player.getStreamSyncedMeta("guesswho:team");
    // alt.log("team", team);
    let text;
    if (team === "hunter") {
        text = new alt.WebView("http://resource/client/gamemode/guess-who/game/browser/hunterText.html");
        await alt.Utils.wait(5000);
        toggleHunterControls(true);
        text.emit("fade:out");
        await alt.Utils.screenFadeIn(500);
    } else if (team === "hider") {
        text = new alt.WebView("http://resource/client/gamemode/guess-who/game/browser/hiderText.html");
        initHider();
        toggleHiderControls(true);
        await alt.Utils.screenFadeIn(500);
    }
    await alt.Utils.wait(500);
    native.freezeEntityPosition(player, false);
    alt.onServer("guesswho:game:spectate", onSpectate);
    if (team === "hider") {
        await alt.Utils.wait(5000);
        text.emit("fade:out");
        await alt.Utils.wait(500);
    }
    text.destroy();
});

function onSpectate() {
    const team = player.getStreamSyncedMeta("guesswho:team");
    if (team === "hunter") {
        toggleHunterControls(false);
    } else if (team === "hider") {
        stopHider();
        toggleHiderControls(false);
    }
}

function onResourceStop() {
    native.freezeEntityPosition(player, false);
    native.setEntityCollision(player, true, true);
    native.triggerScreenblurFadeOut(0);
    // restorePlayer();
}

alt.onServer("guesswho:game:stop", async () => {
    // restorePlayer();
    const team = player.getStreamSyncedMeta("guesswho:team");
    if (team === "hunter") {
        toggleHunterControls(false);
    } else if (team === "hider") {
        stopHider();
        toggleHiderControls(false);
    }
    gameEnd();
});

alt.onServer("guesswho:game:end", (winner) => {
    const team = player.getStreamSyncedMeta("guesswho:team");
    const win = winner === team;
    console.log(winner, team);
    if (win) alt.log("You won!");
    else alt.log("You lost!");
    const text = new alt.WebView("http://resource/client/gamemode/guess-who/game/browser/winnerText.html");
    text.emit("winner", winner, win);
    const deleteText = async () => {
        alt.offServer("guesswho:game:end", deleteText);
        text.emit("fade:out");
        await alt.Utils.wait(500);
        text.destroy();
        gameEnd();
    };
    alt.onServer("guesswho:game:stop", deleteText);
});

function gameEnd() {
    alt.off("resourceStop", onResourceStop);
    alt.setMeta("menu:enabled", true);
    alt.setMeta("noclip:enabled", true);
    alt.setMeta("respawn:enabled", true);
    alt.Player.displayNametags(true);
}

// alt.on("resourceStart", () => {
//     alt.Utils.wait(10000).then(() => {
//         native.setEntityProofs(player, false, false, false, false, false, false, false, false);
//         console.log("proofs set");
//     });
// });

// new alt.WebView("http://resource/client/gamemode/guess-who/game/browser/hiderHUD.html");
