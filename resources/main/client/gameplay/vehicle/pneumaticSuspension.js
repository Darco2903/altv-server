import * as alt from "alt-client";
import * as native from "natives";

const APP_NAME = "vehiclePneumaticSuspension";
const defaultKeys = {
    toggle: 85, // u
};
const manager = new alt.Utils.InputManager(APP_NAME, defaultKeys);
const player = alt.Player.local;

alt.on("keydown", (key) => {
    if (!player.vehicle || !alt.gameControlsEnabled()) return;
    if (key === manager.keys.toggle) {
        const state = !player.vehicle.getMeta("pneumaticSuspension:active") ?? false;
        player.vehicle.setMeta("pneumaticSuspension:active", state);
        native.setReducedSuspensionForce(player.vehicle, state);
    }
});
