import * as alt from 'alt';
import * as chat from 'chat';
import { setInterval, setTimeout } from 'timers';
//import {db} from '../database/server.js';
import * as Function from './data/Functions.js';
import * as Table from './data/Tables.js';
import * as Command from './commandHandler.js'





////////////////////////////////////////////



//DataBase


alt.on('ConnectionComplete', () => {
    
    setTimeout(() => {

        Function.initServer()
        //Function.initServerTimeout(10) //20min

        
        const vehicles = alt.Vehicle.all
        if (!vehicles[0]) {
            Function.serverStartVehicleSpawn()
        }

        setInterval(() => {

            Function.savePlayers()
            Function.saveVehicles()
            Function.saveTime()

        }, 5000);

    }, 500);

});




////////////////////////////////////////////

let respawn = true


//Player Connection


alt.on('playerConnect', (player) => {
    //Function.AuthPlayer(player)
    Function.spawn(player)
    alt.emitClient(player, 'load:Locations')

    //Function.setTime(player)

    //Function.initServerTimeout()
});


alt.on('playerDisconnect', (player, reason) => {

    //if (alt.Player.all == {}) Function.initServerTimeout(120) //10min (1 = 5s)
    /*
    db.updatePartialData(player.getSyncedMeta('id'),
        { position: JSON.stringify(player.pos) },
        'Character',
        res => {
        }
    );*/
    alt.log(`${player.name} disconnected from the server : ${reason}`)
    chat.broadcast(`{00FFFF}${player.name} {000000}allez hop ça dégage`)
});


alt.on('playerDeath', (victim, killer, weaponHash) => {
    if (!respawn) {
        return
    }

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



alt.onClient('tpm:PlayerTPM', (player, coords) => {
    if (coords == undefined) {
        chat.send(player, '{ff8f00}Please set GPS first')
    } else {
        if (player.vehicle) {
            Function.tpmVehicle(player, coords)
            //alt.emitClient(player, 'tpm:VehicleTPM', (coords))
            return
        }
        player.spawn(coords)
    }
})



//////////////////////////////////////////////




alt.onClient('giveWeapon:Player', (player, weap) => {
    if (weap == 'all') {
        console.log(player.name, 'gived all weapons')
        for(var hash in Table.weaponList) {
            Function.weapongive(player, hash)
        }
    } else {
        console.log(player.name, 'gived', weap)
        Function.weapongive(player, weap)
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
        Function.setCustomPlayerModel(player, data)
        return
    }
    Function.setNewPlayerModel(player, pm)
})




alt.onClient('editClothes:Player', (player, clothes) => {
    Function.editPlayerClothes(player, clothes)
})



alt.onClient('saveClothes:Player', (player) => {
    Function.savePlayerClothes(player)
    chat.send(player, '{00ff00}Clothes saved')
})


/*
alt.onClient('discardChange:Player', (player) => {
    Function.setPlayerClothes(player, player.getSyncedMeta('clothes'))
})
*/






//////////////////////////////////////////////////////////////////////////




//      Gestion des véhicules





alt.onClient('spawn:Vehicle', (player, model) => {
    model = JSON.parse(model)
    if (Table.vehicleList[model]) {
        model = Table.vehicleList[model]
    }
    Function.createVehicle(player, model)
})


alt.onClient('vehicle:CustomColor', (player, arg) => {
    var parsedColor1 = ['', parseInt(arg[0]), parseInt(arg[1]), parseInt(arg[2]), parseInt(arg[6]), parseInt(arg[7])]
    var parsedColor2 = ['', parseInt(arg[3]), parseInt(arg[4]), parseInt(arg[5]), parseInt(arg[6]), parseInt(arg[7])]
    Function.color(player, parsedColor1, 1)
    Function.color(player, parsedColor2, 2)
})

alt.onClient('vehicle:Color', (player, arg) => {
    player.vehicle.primaryColor = arg[0]
    player.vehicle.secondaryColor = arg[1]
})



alt.onClient('vehicle:Setmod', (player, mod) => {
    var vehicle = player.vehicle
    //vehicle.modKit = 0;
    if (vehicle.modKit < 1) vehicle.modKit = 0
    
    vehicle.setMod(parseInt(mod[0]), parseInt(mod[1]));
    //Function.getAppearance(vehicle)
})

alt.onClient('vehicle:SetWheels', (player, wheels) => {
    var vehicle = player.vehicle
    wheels = [parseInt(wheels[0]), parseInt(wheels[1]), parseInt(wheels[2])]
    vehicle.setWheels(wheels[0], wheels[1])
    vehicle.wheelColor = wheels[2]
})
/*
alt.onClient('save:Vehicle', (player) => {
    const vehicle = player.vehicle
    if (player.name != vehicle.getSyncedMeta('owner')) {
        if (!Function.authorized(player, 2)) {
            return chat.send(player, '{ff8f00}This is not your vehicle')
        }
    }
    Function.getAppearance(vehicle)
    chat.send(player, '{00FF00}Vehicle Saved')
})
*/
/*
alt.onClient('discardChange:Vehicle', (player) => {
    const vehicle = player.vehicle
    const appearance = vehicle.getSyncedMeta('appearance')
    
    vehicle.setAppearanceDataBase64(appearance)
})
*/

alt.onClient('vehicle:ToRepair', (player, vehicle) => {
    if (!vehicle) {
        return chat.send(player, '{ff8f00}No vehicle found')
    }
    const rot = vehicle.rot
    vehicle.rot = {x: 0, y: rot.y, z: rot.z}
    vehicle.repair()
    //chat.send(player, `{00FF00}${vehicle.getSyncedMeta('model')} fixed`)
})


alt.onClient('vehicle:Neons', (player, color) => {
    var parsedNeons = [color[0], color[1], color[2]]
    Function.neons(player, parsedNeons)
})







////////////////////////////////////////////////////////////////////


//Misc



alt.onClient('NoClip:Request', (player) => {
    if (!Function.authorized(player, 2)) {
        return
    }
    alt.emitClient(player, 'NoClip:Toggle')
})


