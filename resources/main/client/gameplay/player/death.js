import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

function deadMessage() {
    const tick = alt.everyTick(() => {
        alt.Utils.drawText3dThisFrame(
            "Press ~b~E ~w~to respawn",
            new alt.Vector3(alt.Player.local.pos).add(0, 0, 0.5),
            0,
            0.4,
            new alt.RGBA(255, 255, 255, 255),
            false,
            false,
            0
        );
        if (alt.isKeyDown(69)) {
            alt.clearEveryTick(tick);
            const heading = player.headRot.toDegrees().y;
            native.resurrectPed(player);
            native.startPlayerTeleport(player, player.pos.x, player.pos.y, player.pos.z, heading, false, true, false);
            native.clearPedBloodDamage(player);
        }
    });
}

alt.onServer("player:death", () => {
    deadMessage();
});

alt.on("resourceStart", async () => {
    alt.setTimeout(() => {
        console.log(player.isDead, player.isSpawned);
        if (player.isDead && player.isSpawned) {
            deadMessage();
        }
    }, 100);
});
