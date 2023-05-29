import * as alt from "alt-client";

let displayTick;

/**
 * @param {alt.Player} player The Player
 */
function setName(player) {
    const pos = player.pos;
    const dist = alt.Player.local.pos.distanceTo(pos);
    if (dist < 50) {
        let scale = dist ** -0.8;
        if (scale > 0.4) {
            scale = 0.4;
        }
        alt.Utils.drawText3dThisFrame(player.name, player.pos.add(0, 0, 1), 6, scale, new alt.RGBA(255, 255, 255, 255), true, false, 0);
    }
}

/**
 * @param {boolean} state
 */
alt.Player.displayNametags = function (state) {
    if (state && !displayTick) {
        displayTick = alt.everyTick(() => alt.Player.streamedIn.forEach(setName));
        alt.setMeta("display:nametags", true);
    } else if (!state && displayTick) {
        alt.clearEveryTick(displayTick);
        displayTick = undefined;
        alt.setMeta("display:nametags", false);
    }
};

alt.on("resourceStart", () => {
    if (!alt.hasMeta("display:nametags")) {
        alt.setMeta("display:nametags", true);
    }
    alt.Player.displayNametags(alt.getMeta("display:nametags"));
});
