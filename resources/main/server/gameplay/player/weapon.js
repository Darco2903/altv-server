import * as alt from "alt-server";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const weapons = require("../../../../data-pack/content/weapon/weapons.json");
const weaponsMod = require("../../../../data-pack/content/weapon/weaponsMod.json");
// const ammoTypes = require("../../../../data-pack/content/weapon/ammoTypes.json");

alt.onClient("player:weapon:give", (player, hash, ammoAmount) => {
    player.giveWeapon(hash, ammoAmount, true);
    const ammoType = alt.getAmmoHashForWeaponHash(hash);
    player.setAmmoMax(ammoType, 9999);
});

alt.onClient("player:weapon:giveAll", (player) => {
    weapons.concat(weaponsMod).forEach((weapon) => {
        player.giveWeapon(weapon.Hash, 9999, false);
        const ammoType = alt.getAmmoHashForWeaponHash(weapon.Hash);
        player.setAmmoMax(ammoType, 9999);
        player.setAmmo(ammoType, 9999);
    });
});

alt.onClient("player:weapon:removeAll", (player) => {
    player.removeAllWeapons(true);
});

alt.onClient("player:weapon:refillAmmo", (player, ammoAmount) => {
    player.weapons.forEach((weap) => {
        const ammoType = alt.getAmmoHashForWeaponHash(weap.hash);
        player.setAmmo(ammoType, ammoAmount);
    });
});

alt.onClient("player:weapon:infinitAmmo", (player, state) => {
    player.weapons.forEach((weap) => {
        const ammoType = alt.getAmmoHashForWeaponHash(weap.hash);
        player.setAmmoFlags(ammoType, state, false, false, false);
    });
});
