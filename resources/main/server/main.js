import * as alt from 'alt-server';
import * as chat from 'chat';
import * as db from "database"
import * as Functions from "./functions"



Functions.update()



//  let autoSave = false
//  let saveTime = 5            //  minutes


function log (msg) {
    alt.log("~y~" + msg)
}

alt.on("serverStarted", () => import("./autoReconnect"))    // Dev

alt.on("consoleCommand", (string) => {
    if (!string) return
    string = string.splitAll(' ')
    const command = string[0]
    const args = string.splice(1)
    switch (command) {
        case "reboot":
            restartServer()
            break;

        case "kick":
            let toKick = searchPlayer(idOrName)
            if (!toKick) {
                log("Player not found")
                return
            }
            kick(toKick, "Server")
            break;
    
        default:
            break;
    }
})


chat.registerCmd("r", (player, [resourceName]) => {
    //if (!Functions.authorized(player, 4))
    //    return

    if (resourceName)
        restartResource(resourceName)
    else
        restartServer()
})

chat.registerCmd("save", saveServer)

function saveServer () {
    alt.emit("save")
}

export function restartServer () {
    saveServer()
    //alt.emitAllClients("serverStop")
    const msg = "Server Restarting"
    //alt.Player.all.forEach(player => player.kick(msg))
    log(msg)
    setTimeout(alt.stopServer, 200);
}


export function restartResource (res) {
    //if (res == "r") alt.restartResource("chat")
    //else alt.restartResource(res)
    alt.restartResource(res)
    chat.broadcast(`{00ff00}${res} restarted`)
}

chat.registerCmd("kick", (player, [idOrName]) => {
    kickCommand(player, idOrName)
})

function kickCommand (player, idOrName) {
    if (!idOrName) {
        chat.send(player, "{55555}/kick [playerName] or [playerID]")
        return
    }
    let toKick = searchPlayer(idOrName)
    if (!toKick) {
        chat.send(player, "{ff8f00}Player not found")
        return
    }
    kick(idOrName, player.name)
}

function kick (kicked, kickerName, message) {
    message = message || "Tépa bo désl"
    //  chat.broadcast(`${kicked.name} was kicked by ${kickerName} - Reason : ${message}`)
    kicked.kick(`Kicked by ${kickerName} : ${message}`)
}

function searchPlayer (idOrName) {
    if (!isNaN(idOrName)) {
        idOrName = parseInt(idOrName)
        return alt.Player.all.find((player) => player.getSyncedMeta("id") === idOrName)
    } else
        return alt.Player.all.find((player) => player.name === idOrName)

}

chat.registerCmd("dim", (player, [dim]) => {
    if (!dim) {
        console.log("player dimension", player.dimension);
        if (player.vehicle)
            console.log("vehicle dimension", player.vehicle.dimension);
        return
    }
    if (isNaN(dim)) return
    if (player.vehicle)
        player.vehicle.dimension = dim
    player.dimension = dim
})

chat.registerCmd("getpos", (player) => {
    let pos = player.pos.toFixed(3)
    pos.dim = player.dimension
    chat.send(player, `${pos}`)
    console.log(pos);
})

chat.registerCmd("hash", (player, [string]) => {
    if (!string) return
    console.log(alt.hash(string));
})


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







/*

const nameSwap = {

    fd: "RX7",
    toysupmk4: "Supra",
    "370z": "370Z",
    toy86: "GT86",
    gtr: "GTR-R35",
    skyline: "Skyline R34",
    "18performante": "Huracan Performante",
    
    ninjah2: "Ninja H2R",
    s1000rr: "S1000RR",
}

setTimeout(() => {
    let parsed = {}
    Object.keys(nameSwap).forEach((key) => parsed[key] = {Name: key, DisplayName: nameSwap[key], Hash: alt.hash(key), Class: "MOD"})

    console.log(parsed);
}, 2000);

*/

//  setTimeout(() => {
//      //  console.log(alt.getServerConfig());
//      let hash = alt.hash("toysupmk4")
//      //console.log(alt.getPedModelInfoByHash(hash));
//      console.log(alt.getVehicleModelInfoByHash(hash));
//  }, 1500);