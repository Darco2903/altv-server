import * as alt from "alt-server";

alt.onClient("player:giveAllWeapons", (player) => {
    // player.giveWeapon();
});
alt.onClient("player:removeWeapons", (player) => player.removeAllWeapons());
alt.onClient("player:giveWeapon", (player, hash, amount, equipNow) => {
    player.giveWeapon(hash, parseInt(amount), equipNow);
});
