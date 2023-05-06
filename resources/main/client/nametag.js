import * as alt from "alt-client";

let displayTick;

alt.on("resourceStart", () => {
    if (!alt.hasMeta("display:nametags")) {
        alt.setMeta("display:nametags", true);
    }
    display(alt.getMeta("display:nametags"));
});

/**
 * @param {alt.Player} player The Player
 */
function setName(player) {
    const pos = player.pos;
    const dist = alt.Player.local.pos.distanceTo(pos);
    if (dist < 50) {
        const scale = dist < 6.8 ? 0.3 : 2 / dist;
        alt.Utils.drawText3d(player.name, x, y, z + 1, scale, 0, 255, 255, 255, 255);
    }
}

/**
 * @param {boolean} state
 */
export function display(state) {
    if (state && !displayTick) {
        displayTick = alt.everyTick(() => alt.Player.streamedIn.forEach(setName));
        alt.setMeta("display:nametags", true);
    } else if (!state && displayTick) {
        alt.clearEveryTick(displayTick);
        displayTick = undefined;
        alt.setMeta("display:nametags", false);
    }
}
