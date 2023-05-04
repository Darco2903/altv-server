import * as alt from "alt-server";
import { db, tables } from "./database/index.js";
import * as chat from "./chat.js";
import * as vehicles from "./vehicles.js";

// import "./prototype/Checkpoint.js";
import "./prototype/Player.js";
import "./prototype/Utils.js";
import "./prototype/Vehicle.js";

// import "./garage.js";
// import "./musicPlayer.js"
import "./noclip.js";
import "./players.js";
// import "./time-weather.js";

//  let autoSave = false
//  let saveTime = 5            //  minutes

// alt.on("serverStarted", () => {
//     import("./autoReconnect");
// }); // Dev

alt.on("consoleCommand", (command, args) => {
    switch (command) {
        case "r":
            alt.stopServer();
            break;

        case "reboot":
            // restartServer();
            break;

        case "hash":
            if (args) {
                alt.log(`hash: ${alt.hash(args)}`);
            }
            break;

        //  case "kick":
        //      console.log(args[0]);
        //      let toKick = searchPlayer(args[0])
        //      if (!toKick) {
        //          log("Player not found")
        //          return
        //      }
        //      kick(toKick, "Server")
        //      break;

        default:
            // log(`Unknow command: ${command}`);
            break;
    }
});

// chat.registerCmd("r", (player, [resourceName]) => {
//     //if (!Functions.authorized(player, 4))
//     //    return

//     if (resourceName) {
//         restartResource(resourceName, player);
//     } else {
//         restartServer();
//     }
// });

// chat.registerCmd("save", saveServer);

// function saveServer() {
//     alt.emit("save");
// }

// export function restartServer() {
//     saveServer();
//     //alt.emitAllClients("serverStop")
//     const msg = "Server Restarting";
//     //alt.Player.all.forEach(player => player.kick(msg))
//     log(msg);
//     setTimeout(alt.stopServer, 200);
// }

export function restartResource(name, player) {
    if (alt.hasResource(name)) alt.restartResource(name);
    else name = "ERROR";
    alt.emitClient(player, "notification", "restartResource", name);
}

// chat.registerCmd("kick", (player, [idOrName]) => {
//     kickCommand(player, idOrName);
// });

function kickCommand(player, idOrName) {
    if (!idOrName) {
        alt.emitClient(player, "notification", "command", "/kick [nom du joueur]\n/kick [ID du joueur]");
        return;
    }
    let toKick = searchPlayer(idOrName);
    if (!toKick) {
        alt.emitClient(player, "notification", "command", `Le joueur ${idOrName} n'a pas été trouvé`);
        return;
    }
    kick(idOrName, player.name);
    alt.emitClient(player, "notification", "success", `Le joueur ${idOrName} a été kick`);
}

function kick(kicked, kickerName, message) {
    message = message || "Tépa bo désl";
    //  chat.broadcast(`${kicked.name} was kicked by ${kickerName} - Reason : ${message}`)
    kicked.kick(`Kicked by ${kickerName} : ${message}`);
}

function searchPlayer(idOrName) {
    if (!isNaN(idOrName)) {
        idOrName = parseInt(idOrName);
        return alt.Player.all.find((player) => player.getSyncedMeta("id") === idOrName);
    } else return alt.Player.all.find((player) => player.name === idOrName);
}

// chat.registerCmd("dim", (player, [dim]) => {
//     if (!dim) {
//         console.log("player dimension", player.dimension);
//         if (player.vehicle) console.log("vehicle dimension", player.vehicle.dimension);
//         return;
//     }
//     if (isNaN(dim)) return;
//     if (player.vehicle) player.vehicle.dimension = dim;
//     player.dimension = dim;
// });

// chat.registerCmd("getpos", (player) => {
//     let pos = player.pos.toFixed(3);
//     pos.dim = player.dimension;
//     chat.send(player, `${pos}`);
//     console.log(pos);
// });

// chat.registerCmd("hash", (player, [string]) => {
//     if (!string) return;
//     console.log(alt.hash(string));
// });

// chat.registerCmd("debug", (player, [enable]) => {
//     switch (enable) {
//         case "true":
//         case "false":
//             alt.emitAllClients("debug", enable === "true");
//             break;

//         default:
//             alt.emitClient(player, "notification", "command", "/debug true\n/debug false");
//             break;
//     }
// });

////////////////////////////////////////////

/*
alt.onClient('tpm:PlayerTPM', (player, coords, veh) => {
    if (coords == undefined) {
        chat.send(player, '{ff8f00}Please set GPS first')
    } else {
        if (!veh) return player.spawn(coords)

        Functions.tpmVehicle(player, veh, coords)
        //alt.emitClient(player, 'tpm:VehicleTPM', (coords))
    }
})
*/

//////////////////////////////////////////////

/*
alt.onClient('giveWeapon:Player', (player, weap) => {
    if (weap == 'all') {
        console.log(player.name, 'gived all weapons')
        for(let hash in Tables.weaponList) {
            Functions.weapongive(player, hash)
        }
    } else {
        console.log(player.name, 'gived', weap)
        Functions.weapongive(player, weap)
    }
})
*/

/*
alt.onClient('setpm:SendToServer', (player, pm) => {

    let data = Tables.playerModelsList[pm]
    
    if (!data) {
        try {
            player.model = pm
            return
        } catch {}
    }

    if (data.pm) {
        Functions.setCustomPlayerModel(player, data)
        return
    }
    Functions.setNewPlayerModel(player, pm)
})
*/

/*
alt.onClient('editClothes:Player', (player, clothes) => {
    Functions.editPlayerClothes(player, clothes)
})
*/

/*
alt.onClient('saveClothes:Player', (player) => {
    Functions.savePlayerClothes(player)
    chat.send(player, '{00ff00}Clothes saved')
})
*/

/*
alt.onClient('discardChange:Player', (player) => {
    Functions.setPlayerClothes(player, player.getSyncedMeta('clothes'))
})
*/

////////////////////////////////////////////////////////////////////

//Misc

/*
alt.onClient('NoClip:Request', (player) => {
    if (!Functions.authorized(player, 2)) {
        return
    }
    alt.emitClient(player, 'NoClip:Toggle')
})
*/

//  setTimeout(() => {
//      //  console.log(alt.getServerConfig());
//      let hash = alt.hash("toysupmk4")
//      //console.log(alt.getPedModelInfoByHash(hash));
//      console.log(alt.getVehicleModelInfoByHash(hash));
//  }, 1500);
