import * as alt from 'alt-server';
import * as chat from 'chat';
import * as db from "database"
import { color } from "server-extended";
import {globalFunction, globalTable} from "exports"
import { Player } from './Player';


//import * as extended from "server-extended"
//import { createRequire } from 'module'
//const require = createRequire(import.meta.url)

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
    if (!db)
        return false
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
    const veh = victim.veh
    alt.emitClient(victim, 'player:Death')
    let pos = victim.pos
    setTimeout(() => {        
        victim.clearBloodDamage()
        if (veh)
            alt.emitClient(victim, 'vehicle:SetPlayerIn', (veh))
        else
            victim.spawn(pos.x, pos.y, pos.z)
    }, 5000);
    const deathCause = globalTable.CauseOfDeath[weaponHash]
    if (killer) {
        if (killer.name == victim.name) {
            alt.log(`${victim.name} kill himself with ${deathCause}`)
            chat.broadcast(`{00FFFF}${victim.name} {FFFFFF}s'est tué avec ${deathCause}`)
            return
        } else {
            alt.log(`${victim.name} was killed by ${killer.name} with ${deathCause}`)
            chat.broadcast(`{00FFFF}${victim.name} {FFFFFF}a été tué par {FF0000}${killer.name} {FFFFFF}avec {00FF00}${deathCause}`)
        }
    } else {
        alt.log(`${victim.name} is dead of ${deathCause}`)
        chat.broadcast(`{00FFFF}${victim.name} {FFFFFF}est mort de {00FF00}${deathCause}`)
    }

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
        for(let hash in globalTable.weaponList) {
            globalFunction.weapongive(player, hash)
        }
    } else {
        console.log(player.name, 'gived', weap)
        globalFunction.weapongive(player, weap)
    }
})




alt.onClient('setpm:SendToServer', (player, pm) => {

    let data = globalTable.playerModelsList[pm]
    
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