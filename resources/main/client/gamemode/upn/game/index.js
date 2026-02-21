import * as alt from "alt-client";
import * as native from "natives";
import { toggleHuntersControls } from "../player/hunter.js";
import { toggleSurvivorsControls, survivorCommands } from "../player/survivor.js";

const player = alt.Player.local;

let gameStarted = false;
let controlsTick;
let controlsEnabler = () => {};

function toggleControls(state) {
    if (state && !controlsTick) {
        controlsTick = alt.everyTick(() => {
            native.disableAllControlActions(0); // Disable controls
            controlsEnabler();
        });
    } else if (!state && controlsTick) {
        alt.clearEveryTick(controlsTick);
        controlsTick = null;
    }
}

alt.onServer("upn:game:ready", async () => {
    alt.emit("upn:countdown:init");
    alt.Utils.screenFadeIn(500);
    native.setGameplayCamRelativeHeading(0);
    controlsEnabler = () => {
        native.enableControlAction(0, 1, true); // LookLeftRight
        native.enableControlAction(0, 2, true); // LookUpDown
        native.hideHudAndRadarThisFrame();
    };
    toggleControls(true);
    // await alt.Utils.wait(3000);
    // if (player.getStreamSyncedMeta("upn:team") === "hunters") {
    //     native.setVehicleEngineOn(player.vehicle, true, false, true);
    // }
});

alt.onServer("upn:game:start", () => {
    gameStarted = true;
    alt.emit("speedo-forza:disable", false);
    // console.log("upn:game:start");
    if (player.getStreamSyncedMeta("upn:team") === "hunters") {
        controlsEnabler = toggleHuntersControls;
    } else if (player.getStreamSyncedMeta("upn:team") === "survivors") {
        controlsEnabler = toggleSurvivorsControls;
        alt.on("keydown", survivorCommands);
        player.maxStamina = 1;
        if (native.isDisabledControlPressed(0, 21)) {
            native.setRunSprintMultiplierForPlayer(player, 1.49);
        }
    } else {
        // spectator
    }
});

alt.onServer("upn:stop", () => {
    if (!gameStarted) return;
    toggleControls(false);
    gameStarted = false;
    native.setRunSprintMultiplierForPlayer(player, 1);
    player.maxStamina = 100;
    alt.off("keydown", survivorCommands);
    alt.emit("noclip:disable", false);
    alt.emit("menu:disable", false);
});
