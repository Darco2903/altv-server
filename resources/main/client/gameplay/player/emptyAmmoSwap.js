import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

alt.on("playerWeaponShoot", (weaponHash, totalAmmo, ammoInClip) => {
    if (totalAmmo === 0) {
        native.taskSwapWeapon(player, false);
    }
});
