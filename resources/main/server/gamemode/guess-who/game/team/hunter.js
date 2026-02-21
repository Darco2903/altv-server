import * as alt from "alt-server";
import Teams from "../teams.js";

const HUNTER_HEALTH = 800;

alt.on("guesswho:game:start", () => {
    alt.on("pedDamage", pedDamage);
});

alt.on("guesswho:game:stop", () => {
    alt.off("pedDamage", pedDamage);
    Teams.hunters.forEach((player) => setHealth(player, 200));
});

function pedDamage(ped, attacker, healthDamage, armourDamage, weapons) {
    console.log("pedDamage", ped, attacker, healthDamage, Teams.hunters.includes(attacker));
    if (!Teams.hunters.includes(attacker)) return;
    attacker.health -= healthDamage;
}

function setHealth(player, health) {
    if (!player.valid) return;
    player.maxHealth = health;
    player.health = health;
}

export function initHunters() {
    Teams.hunters.forEach((player) => {
        player.model = "mp_m_freemode_01";
        setHealth(player, HUNTER_HEALTH);
        player.giveWeapon("weapon_pistol", 36, true);
        player.giveWeapon("weapon_pumpshotgun", 16, true);
        // player.giveWeapon("weapon_carbinerifle", 90, true);
        // player.giveWeapon("weapon_sniperrifle", 20, true);
        player.giveWeapon("weapon_grenade", 1, true);
        // player.giveWeapon("weapon_knife", 0, true);
        player.giveWeapon("weapon_smg", 90, true);
        // player.giveWeapon("weapon_rpg", 1, true);
        player.currentWeapon = alt.hash("weapon_pistol");
    });
}
