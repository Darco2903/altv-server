import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

function deadMessage() {
    const tick = alt.everyTick(() => {
        alt.Utils.drawText3dThisFrame(
            "Appuyez sur ~b~E ~w~pour réapparaître",
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
            setTimeout(() => {
                if (player.isDead) {
                    deadMessage();
                }
            }, 500);
        }
    });
}

alt.onServer("player:death", () => {
    deadMessage();
});

alt.on("resourceStart", async () => {
    alt.setTimeout(() => {
        if (player.isDead && player.isSpawned) {
            deadMessage();
        }
    }, 100);
});

// auto kill
// alt.on("keydown", (key) => {
//     // alt.KeyCode.A
//     if (key === 65) {
//         native.setEntityHealth(player, 0, 0);
//     }
// });
