import * as alt from "alt-client";
import * as native from "natives";

const player = alt.Player.local;

const view = new alt.WebView("http://resource/client/gameplay/ui/playerweapon/browser/index.html");
view.isVisible = false;

view.on("weapon:player", async (weapon, ammoAmount) => {
    const hash = alt.hash(weapon);
    native.giveWeaponToPed(player, hash, ammoAmount, false, true);
});

view.on("weapon:player:all", async (weapons) => {
    weapons.forEach((weapon) => {
        const hash = alt.hash(weapon);
        alt.setStat("shooting_ability", 100);
        native.giveWeaponToPed(player, hash, 9999, false, false);
    });
});

view.on("search:start", () => {
    alt.toggleGameControls(false);
});

view.on("search:end", () => {
    alt.toggleGameControls(true);
});

function toggle(state) {
    if (state !== view.isVisible) {
        view.isVisible = state;
        if (alt.isCursorVisible() !== state) alt.showCursor(state);
        player.lockCamera(state);
        alt.emit("chat:enabled", !state);
        if (state) {
            view.focus();
        } else {
            view.unfocus();
        }
    }
}

alt.on("menu:option:open", (id) => {
    if (id === "playerweapon") {
        toggle(true);
    }
});

alt.on("ui:close:all", () => {
    toggle(false);
});

alt.on("keyup", (key) => {
    if (key === 27 && view.isVisible && alt.gameControlsEnabled()) {
        // Escape
        toggle(false);
    }
});
