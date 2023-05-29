import * as alt from "alt-server";

alt.on("playerDeath", (victim, killer, weaponHash) => {
    alt.emitClient(victim, "player:death");
    if (killer && weaponHash) {
        alt.log(`~c~${victim.name} was killed by ${killer.name} with ${weaponHash}`);
    } else if (killer) {
        alt.log(`~c~${victim.name} was killed by ${killer.name}`);
    } else if (weaponHash) {
        alt.log(`~c~${victim.name} killed himself with ${weaponHash}`);
    } else {
        alt.log(`~c~${victim.name} died`);
    }
});
