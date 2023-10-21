import * as alt from "alt-client";
import * as native from "natives";
import keyCode from "@data-pack/content/input-key/keyCode.js";

const player = alt.Player.local;
const defaultKeys = {
    respawn: 69, // E
};
const inputKeys = Object.assign({}, defaultKeys);
const APP_NAME = "respawn";

function deadMessage() {
    const tick = alt.everyTick(() => {
        if (!player.isDead || player.health > 0 || !player.isSpawned) {
            alt.clearEveryTick(tick);
        }

        alt.Utils.drawText3dThisFrame(
            `Appuyez sur ~b~${keyCode[inputKeys.respawn]} ~w~pour réapparaître`,
            alt.Player.local.pos.add(0, 0, 0.5),
            0,
            0.4,
            new alt.RGBA(255, 255, 255, 255),
            false,
            false,
            0
        );

        if (alt.isKeyDown(inputKeys.respawn) && alt.gameControlsEnabled()) {
            alt.clearEveryTick(tick);
            const heading = player.headRot.toDegrees().y;
            const vehicle = player.vehicle;
            const seat = -player.seat;
            native.resurrectPed(player);
            native.clearPedBloodDamage(player);

            if (!vehicle) {
                native.startPlayerTeleport(player, player.pos.x, player.pos.y, player.pos.z, heading, false, true, false);
            } else {
                native.setPedIntoVehicle(player, vehicle, seat);
            }

            setTimeout(() => {
                if (player.isDead) {
                    deadMessage();
                }
            }, 500);
        }
    });
}

alt.onServer("player:death", deadMessage);

alt.on("resourceStart", () => {
    alt.setTimeout(() => {
        if (player.isDead && player.isSpawned) deadMessage();
    }, 100);

    Object.keys(defaultKeys).forEach((name) => {
        inputKeys[name] = alt.LocalStorage.get(`${APP_NAME}:key:${name}`) ?? defaultKeys[name];
        alt.emit("input-manager:keyInit", APP_NAME, name, inputKeys[name]);
    });
});

alt.on("input-manager:keyUpdate", (app, name, key) => {
    if (app !== APP_NAME) return;
    inputKeys[name] = key;
    alt.LocalStorage.set(`${APP_NAME}:key:${name}`, key);
    alt.LocalStorage.save();
});

alt.on("input-manager:keyReset", (app, name) => {
    if (app !== APP_NAME) return;
    inputKeys[name] = defaultKeys[name];
    alt.emit("input-manager:keyInit", APP_NAME, name, inputKeys[name]);
    alt.LocalStorage.delete(`${APP_NAME}:key:${name}`);
    alt.LocalStorage.save();
});
