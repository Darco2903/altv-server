import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

let isEnable = false;
let isActive = false;

function main() {
    const v = native.getEntitySpeedVector(player.vehicle, true).toFixed(2);
    const relativeVelocityAngle = Math.atan2(v.y, v.x) % Math.PI;
    const angleDifference = relativeVelocityAngle === 0 ? 0 : relativeVelocityAngle - Math.PI / 2;

    let left = angleDifference > 0.2;
    let right = angleDifference < -0.2;

    const active = isEnable && (left || right);

    if (active !== isActive) {
        isActive = active;
        alt.emit("esc:active", active);
    }

    if (active) {
        if (left) {
            console.log("left");
            native.setControlValueNextFrame(0, 63, 1);
        } else if (right) {
            console.log("right");
            native.setControlValueNextFrame(0, 64, 1);
        }
    }
}

function set(state) {
    isEnable = state;
    alt.emit("esc:enable", state);
    alt.LocalStorage.set("esc:enable", state);
    alt.LocalStorage.save();
}

alt.on("resourceStart", () => {
    const esc = alt.LocalStorage.get("esc:enable") ?? false;
    set(esc);
});

alt.on("electronics:esc:toggle", set);
alt.onServer("electronics:esc:toggle", set);

export { main, set, isEnable, isActive };
