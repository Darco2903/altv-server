import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let isEnable = false;
let isActive = false;
let cooldown = false;
let softness = 1 - 0.9;
let hardness = (1 - 0.9) * 5;
let timeout;

function main() {
    const speed = player.vehicle.getRealSpeed();
    const active =
        isEnable &&
        ((native.isControlPressed(0, 71) && speed > 0) || (native.isControlPressed(0, 72) && speed < 0)) &&
        player.vehicle.speed > player.vehicle.speedVector.length + hardness + player.vehicle.speedVector.length / 10;

    if (active !== isActive) {
        isActive = active;
        const time = active ? 0 : 500;
        timeout = setTimeout(() => {
            alt.emit("tc:active", active);
            if (timeout) clearTimeout(timeout);
            timeout = null;
        }, time);
    }

    if (active && !cooldown) {
        native.disableControlAction(0, 71, false);
        native.disableControlAction(0, 72, false);
        cooldown = true;
        setTimeout(() => {
            cooldown = false;
        }, 1000 * softness);
    }
}

function set(state) {
    isEnable = state;
    alt.emit("tc:enable", state);
    alt.LocalStorage.set("tc:enable", state);
    alt.LocalStorage.save();
}

alt.on("resourceStart", () => {
    const tc = alt.LocalStorage.get("tc:enable") ?? false;
    set(tc);
});

alt.on("electronics:tc:toggle", set);
alt.onServer("electronics:tc:toggle", set);

export { main, set, isEnable, isActive };
