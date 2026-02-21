import * as alt from "alt-client";
import * as native from "natives";

const INIT_POS = new alt.Vector3([284.76, -1239.06, 340.45]);

const player = alt.Player.local;
let tick;
let init = false;

alt.onServer("upn:init", async () => {
    if (init) return;
    init = true;
    await alt.Utils.screenFadeOut(500);
    // alt.toggleGameControls(false);
    alt.emit("noclip:disable", true);
    alt.emit("menu:disable", true);
    alt.setMeta("player:back:pos", player.pos);
    alt.setMeta("player:back:vehicle", player.vehicle);
    alt.setMeta("player:back:seat", player.seat - 2);
    native.setEntityHeading(player, 30);
    native.setGameplayCamRelativeHeading(0);
    native.setGameplayCamRelativePitch(-20, 1);
    native.setEntityVisible(player, false, 0);
    tick = alt.everyTick(() => {
        native.setEntityCoords(player, INIT_POS.x, INIT_POS.y, INIT_POS.z, false, false, false, false);
        native.hideHudAndRadarThisFrame();
        native.disableAllControlActions(0); // Disable controls
        alt.Player.streamedIn.forEach((p) => {
            native.setEntityVisible(p, false, 0);
        });
    });
    await alt.Utils.wait(500);
    native.triggerScreenblurFadeIn(1000);
    await alt.Utils.screenFadeIn(1000);
    alt.emit("upn:teamChoose", true);
});

function clear() {
    init = false;
    native.triggerScreenblurFadeOut(0);
    if (tick) alt.clearEveryTick(tick);
    native.setEntityVisible(player, true, 0);
    alt.Player.streamedIn.forEach((p) => {
        native.setEntityVisible(p, true, 0);
    });
    alt.emit("upn:teamChoose", false);
    alt.emit("speedo-forza:disable", true);
}

alt.onServer("upn:game:init", async () => {
    if (!init) return;
    await alt.Utils.screenFadeOut(500);
    // alt.toggleGameControls(false);
    clear();
});

async function restore() {
    if (!init) return;
    alt.Utils.screenFadeIn(0);
    clear();
    player.pos = alt.getMeta("player:back:pos");
    /** @type {alt.Vehicle} */
    const veh = alt.getMeta("player:back:vehicle");
    if (veh) {
        await alt.Utils.waitFor(() => veh.isSpawned, 2000);
        native.setPedIntoVehicle(player, veh, alt.getMeta("player:back:seat"));
    }
    alt.emit("noclip:disable", false);
    alt.emit("menu:disable", false);
}

alt.onServer("upn:stop", restore);
alt.on("resourceStop", restore);
