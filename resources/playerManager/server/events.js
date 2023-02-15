import * as alt from "alt-server";
import * as db from "database";

alt.onClient("player:giveAllWeapons", (player) => {
    // player.giveWeapon();
});
alt.onClient("player:removeWeapons", (player) => player.removeAllWeapons());
alt.onClient("player:giveWeapon", (player, hash, amount, equipNow) => {
    player.giveWeapon(hash, parseInt(amount), equipNow);
});

alt.onClient("player:setModel", (player, hash) => {
    // const veh = player.vehicle;
    player.model = parseInt(hash);
    // if (veh) player.setIntoVehicle(veh, )
});

alt.onClient("player:SaveModel", (player) => {
    if (!player.hasSyncedMeta("id")) return;
    const id = player.getSyncedMeta("id");
    const model = player.model;
    db.updatePartialData(id, { model }, "Character", (res) => {
        if (!res || res.affected != 1) {
            alt.emitClient(player, "notificationRaw", "CHAR_BLOCKED", "Erreur", "Modèle", "Problème lors de la sauvegarde");
            alt.logError(`model save err ${player.name}`);
        } else alt.emitClient(player, "notificationRaw", "CHAR_DEFAULT", "Succès", "Modèle", "Modèle sauvegardé");
    });
});

alt.onClient("getPlayerVehicles", (player) => {
    player.getVehiclesSaved();
});
