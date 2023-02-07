import * as alt from "alt-server";
import * as chat from "chat";
import * as db from "database";
import { locationsList } from "./locationPos";
import "./Player";
import "./events"

function log(msg) {
    alt.log("~y~" + msg);
}

function saveLog(msg) {
    alt.log("~g~" + msg);
}

alt.on("beforePlayerConnect", (connectionInfo) => {
    return db.isReady();
});

alt.on("save", saveAll);

alt.on("playerConnect", (player) => {
    player.auth();
    log(`${player.name} connected to the server`);
    //  alt.emitClient(player, 'load:Locations')
});

alt.on("playerDisconnect", (player, reason) => {
    player.save();
    log(`${player.name} disconnected from the server : ${reason}`);
    chat.broadcast(`{00FFFF}${player.name} {000000}allez hop ça dégage`);
});

function saveAll() {
    alt.Player.all.forEach((player) => player.save());
    saveLog("All players saved");
}

chat.registerCmd("kill", (player) => {
    player.health = 0;
});

let autoRespawn = true;
alt.on("playerDeath", (victim, killer, weaponHash) => {
    return;
    alt.emitClient(victim, "player:death");
    //const deathCause = CauseOfDeath[weaponHash]
    const veh = victim.vehicle;

    switch (true) {
        case !autoRespawn:
            return;

        case !!veh:
            alt.emitClient(victim, "vehicle:SetPlayerIn", veh);
            break;

        default:
            victim.clearBloodDamage();
            victim.spawn(victim.pos);
            break;
    }
    /*

    if (!autoRespawn)
        return
    const veh = player.veh
    alt.emitClient(player, 'player:Death')
    let pos = player.pos
    setTimeout(() => {        
        player.clearBloodDamage()
        if (veh)
            alt.emitClient(player, 'vehicle:SetPlayerIn', (veh))
        else
            player.spawn(pos.x, pos.y, pos.z)
    }, 5000);
    if (killer) {
        if (killer.name == player.name) {
            log(`${player.name} kill himself with ${deathCause}`)
            chat.broadcast(`{00FFFF}${player.name} {FFFFFF}s'est tué avec ${deathCause}`)
            return
        } else {
            log(`${player.name} was killed by ${killer.name} with ${deathCause}`)
            chat.broadcast(`{00FFFF}${player.name} {FFFFFF}a été tué par {FF0000}${killer.name} {FFFFFF}avec {00FF00}${deathCause}`)
        }
    } else {
        log(`${player.name} is dead of ${deathCause}`)
        chat.broadcast(`{00FFFF}${player.name} {FFFFFF}est mort de {00FF00}${deathCause}`)
    }
*/
});

chat.registerCmd("respawn", (player) => {
    const veh = player.vehicle;
    player.respawn();
    if (veh) player.setIntoVehicle(veh, 1);
});

chat.registerCmd("goto", (player, [nameOrX, y = 0, z = 0]) => {
    if (!nameOrX || (y && isNaN(y)) || (z && isNaN(z))) {
        chat.send(player, "{555555}/goto [nomDuLieu] ou [x, y, z]");
        return;
    }
    let pos;
    if (isNaN(nameOrX)) {
        pos = locationsList[nameOrX];
        if (!pos) {
            chat.send(player, `${nameOrX} inconnu`);
            return;
        }
    } else pos = [nameOrX, y, z].map((value) => parseFloat(value));

    alt.emitClient(player, "player:TP", new alt.Vector3(pos));
    //player.spawn(new alt.Vector3(pos))
});
