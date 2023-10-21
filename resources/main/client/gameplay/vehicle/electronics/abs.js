import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let isEnable = false;
let isActive = false;
let absCooldown = false;
let absSoftness = 1 - 0.9;

function main() {
    const active = isEnable && native.isControlPressed(0, 72) && player.vehicle.getRealSpeed() > 0.5;

    if (active !== isActive) {
        isActive = active;
        alt.emit("abs:active", active);
    }

    if (active && !absCooldown) {
        native.disableControlAction(0, 72, false);
        absCooldown = true;
        setTimeout(() => {
            absCooldown = false;
        }, 1000 * absSoftness);
    }
}

function set(state) {
    isEnable = state;
    alt.emit("abs:enable", state);
    alt.LocalStorage.set("abs:enable", state);
    alt.LocalStorage.save();
}

alt.on("resourceStart", () => {
    const abs = alt.LocalStorage.get("abs:enable") ?? false;
    set(abs);
});

alt.on("electronics:abs:toggle", set);
alt.onServer("electronics:abs:toggle", set);

export { main, set, isEnable, isActive };
