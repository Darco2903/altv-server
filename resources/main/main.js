import * as alt from 'alt-server';
import * as chat from 'chat';
import * as db from "database"
import { color } from "server-extended";
import * as globalFunction from './data/globalFunctions.js';
import * as globalTable from './data/globalTables.js';


//import * as extended from "server-extended"
//import { createRequire } from 'module'
//const require = createRequire(import.meta.url)

export { globalFunction, globalTable }

///////////////////////////////

let autoSave = false
let saveTime = 5    //minutes


globalFunction.update()

//console.log(alt);


alt.on("ConnectionComplete", () => {
    globalFunction.initServer()
    if (autoSave) globalFunction.startAutoSave(saveTime)
    //Function.initServerTimeout(10) //20min
})


////////////////////////////////////////////

let autoRespawn = true

//Player Connection

alt.on("beforePlayerConnect", (connectionInfo) => {
    //  alt.log(connectionInfo.branch); // Prints out the current branch.
    //  alt.log(connectionInfo.authToken); // Prints out the authToken.
    //  alt.log(connectionInfo.build); // Prints out the current build number.
    //  alt.log(connectionInfo.cdnUrl); // Prints out the URL of the CDN.
    //  alt.log(connectionInfo.hwidExHash); // Prints out the ExHash of the client's HWID.
    //  alt.log(connectionInfo.hwidHash); // Prints out the Hash of the client's HWID.
    //  alt.log(connectionInfo.isDebug); // Prints out whether the client is in debug mode.
    //  alt.log(connectionInfo.passwordHash); // Prints out a hash of the password that was used to connect to the server.
    //  alt.log(connectionInfo.socialID); // Prints out the social ID of the client.
    if (!db) return false
})


alt.on('playerConnect', (player) => {
    globalFunction.AuthPlayer(player)
    alt.emitClient(player, 'load:Locations')
    globalFunction.setTime(player)

    //extended.SetupExportsForPlayer(player)
    //Function.initServerTimeout()
});

alt.on('playerDisconnect', (player, reason) => {
    //if (alt.Player.all == {}) Function.initServerTimeout(120) //10min (1 = 5s)
    db.updatePartialData(player.getSyncedMeta('id'), { position: JSON.stringify(player.pos) }, 'Character', res => {})
    alt.log(`${color.FgYellow}${player.name} disconnected from the server : ${reason}`)
    chat.broadcast(`{00FFFF}${player.name} {000000}allez hop ça dégage`)
});


alt.on('playerDeath', (victim, killer, weaponHash) => {
    if (!autoRespawn) return

    alt.emitClient(victim, 'player:Death')
    var pos = victim.pos
    setTimeout(() => {        
        if (victim.vehicle) {
            const vehicle = victim.vehicle
            alt.emitClient(victim, 'vehicle:SetPlayerIn', (vehicle))
        }
        victim.clearBloodDamage()
        victim.spawn(pos.x, pos.y, pos.z)
    }, 5000);
    if (!killer) {
        var killer = 0
    }
    if (killer.name === victim.name) {
        alt.log(`${victim.name} kill himself with ${Table.CauseOfDeath[weaponHash]}`)
        chat.broadcast(`{00FFFF}${victim.name} {FFFFFF}s'est tué avec ${Table.CauseOfDeath[weaponHash]}`)
        return
    }

    chat.broadcast(`{00FFFF}${victim.name} {FFFFFF}a été tué par {FF0000}${killer.name} {FFFFFF}avec {00FF00}${Table.CauseOfDeath[weaponHash]}`)
    alt.log(victim.name, 'was killed by', killer.name, 'with', Table.CauseOfDeath[weaponHash])

});



alt.onClient('tpm:PlayerTPM', (player, coords, veh) => {
    if (coords == undefined) {
        chat.send(player, '{ff8f00}Please set GPS first')
    } else {
        if (!veh) return player.spawn(coords)

        globalFunction.tpmVehicle(player, veh, coords)
        //alt.emitClient(player, 'tpm:VehicleTPM', (coords))
    }
})




//////////////////////////////////////////////




alt.onClient('giveWeapon:Player', (player, weap) => {
    if (weap == 'all') {
        console.log(player.name, 'gived all weapons')
        for(var hash in Table.weaponList) {
            globalFunction.weapongive(player, hash)
        }
    } else {
        console.log(player.name, 'gived', weap)
        globalFunction.weapongive(player, weap)
    }
})




alt.onClient('setpm:SendToServer', (player, pm) => {

    var data = Table.playerModelsList[pm]
    
    if (!data) {
        try {
            player.model = pm
            return
        } catch {}
    }

    if (data.pm) {
        globalFunction.setCustomPlayerModel(player, data)
        return
    }
    globalFunction.setNewPlayerModel(player, pm)
})




alt.onClient('editClothes:Player', (player, clothes) => {
    globalFunction.editPlayerClothes(player, clothes)
})



alt.onClient('saveClothes:Player', (player) => {
    globalFunction.savePlayerClothes(player)
    chat.send(player, '{00ff00}Clothes saved')
})



alt.onClient('discardChange:Player', (player) => {
    globalFunction.setPlayerClothes(player, player.getSyncedMeta('clothes'))
})







//////////////////////////////////////////////////////////////////////////




//      Gestion des véhicules





//  alt.on("updateDB", (data) => {
//      db.updatePartialData(data.id, data.toUpdate, data.table, callback => {})
//  })
//  
//  alt.on("selectDataDB:Send", (get) => {
//      db.selectData(get.table, get.column, res => {alt.emit("selectDataDB:Receive" + get.exId, res)})
//  })
//  
//  alt.on("addDataDB:Send", (add) => {
//      db.upsertData(add.data, add.table, res => {alt.emit("addDataDB:Receive" + add.exId, res)})
//  })
//  
//  alt.on('deleteDataDB', (del) => {
//      db.deleteByIds(del.id, del.table, callback => {})
//  })



////////////////////////////////////////////////////////////////////


//Misc



alt.onClient('NoClip:Request', (player) => {
    if (!globalFunction.authorized(player, 2)) {
        return
    }
    alt.emitClient(player, 'NoClip:Toggle')
})


chat.registerCmd('colorTest', (player) => {
    if (player.vehicle) alt.emitClient(player, 'colorTest')
})