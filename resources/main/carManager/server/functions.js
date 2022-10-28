import * as alt from 'alt-server';
import * as chat from 'chat';
import * as db from "database"
import { color } from "server-extended"
import { globalFunction } from "main"
import { modList } from '../tables';


///////////////////////////////


export function serverStartVehicleSpawn () {
    db.selectData("Vehicle", ['id', 'model', 'position', 'rotation', 'owner', 'appearance', 'garage'], data => {
        data.forEach(vehData => {
            vehData.position = JSON.parse(vehData.position)
            vehData.rotation = JSON.parse(vehData.rotation)
            vehData.appearance = JSON.parse(vehData.appearance)
            vehData.garage = JSON.parse(vehData.garage)
            spawnVehicle(vehData)
            //if (!vehData.garage.inGarage) spawnVehicle(vehData)
        })
        alt.log(`${color.FgCyan}All vehicle spawned`)
    })
}


export function spawnVehicle (vehData) {
    if (!vehData) return
    
    return new Promise((resolve, reject) => {
        let veh
        let position = vehData.position
        let rotation = vehData.rotation

        try {
            veh = new alt.Vehicle(
                vehData.model,
                position.x,
                position.y,
                position.z,
                rotation.x,
                rotation.y,
                rotation.z,
            )
        } catch (err) {
            reject(err)
            return
        }

        veh.manualEngineControl = 1;

        if (veh.modKitsCount < 1) veh.modKit = 0
        else veh.modKit = 1

        if (vehData.appearance) veh.setAppearanceDataBase64(vehData.appearance)
        else {
            veh.primaryColor = 0
            veh.secondaryColor = 0
            vehData.appearance = veh.getAppearanceDataBase64()
        }
        vehData.modData = getVehMod(veh)
        for (const meta in vehData) veh.setSyncedMeta(meta, vehData[meta])
        resolve(veh)
    })
}


export function createVehicle (player, model, save) {
    let pos = globalFunction.vectorFormat(player.pos)
    pos.x += 2
    let vehData = {
        model: model,
        position: pos,
        rotation: {x: 0, y: 0, z: 0},
        owner: player.name,
        appearance: null,
        garage: {inGarage: false}
    }

    spawnVehicle(vehData)
    .then(veh => {
        //if (!save) return
        //const vehData = getVehData(veh)
        //  Object.keys(vehData).forEach(function(key, index) {
        //      vehData[key] = JSON.stringify(vehData)
        //  })
        //  db.upsertData(vehData, 'Vehicle', res => {
        //      veh.setSyncedMeta("id", res.id)
        //      alt.log(`${color.FgRed}Vehicle registered in database`)
        //  })
    })
    .catch(err => alt.logError(err))
}


export function vehCatch (player, x) {
    switch (x) {
        case "noVeh":
            chat.send(player, "{ff8f00}Entrez dans un vehicule avant d'utiliser cette commande")
            break;
        
        case "notOwner":
            chat.send(player, "{ff8f00}Ce n'est pas votre véhicule")
            break;

        default:
            break;
    }
}


export function saveAppearance (vehicle) {
    alt.log('saveAppearance')
    const appearance = vehicle.getAppearanceDataBase64()
    vehicle.setSyncedMeta('appearance', appearance)
    db.updatePartialData(vehicle.getSyncedMeta('id'), {appearance: JSON.stringify(appearance)}, 'Vehicle', callback => {})

}


export function destroyVehicle (vehicle) {
    const id = vehicle.getSyncedMeta('id')
    let msg
    try {
        vehicle.destroy()
        msg = "destroyed"
    } catch {
         msg = "destroyErr"
    }
    db.deleteByIds(id, "Vehicle", callback => {
        if (!callback) msg = " databaseErr"
        else msg = " deleted"
    })
    return msg
}

/*
export function color (player, arg, x) {
    alt.log('color')
    var vehicle = player.vehicle
    var r = arg[1]
    var g = arg[2]
    var b = arg[3]
    var a = arg[4]
    var o = arg[5]
    
    if (0 <= r && r <= 255 && 0 <= g && g <= 255 && 0 <= b && b <= 255) {

        vehicle.pearlColor = o

    } else {
        return chat.send(player, '{ffc100}Les valaurs r g b doivent être comprises entre 0 et 255')
    }

    if (x === 1) {
        vehicle.customPrimaryColor = new alt.RGBA(
            r,
            g,
            b,
            a
        );
    };

    if (x === 2) {
        vehicle.customSecondaryColor = new alt.RGBA(
            r,
            g,
            b,
            a
        );    
    };

    if (x === 3) {
        color(player, arg, 1)
        color(player, arg, 2)
    };
    
    //saveAppearance(vehicle)
}
*/
/*
export function neons (player, neons) {
    var vehicle = player.vehicle
    vehicle.neon = {
        front: true,
        back: true,
        left: true,
        right: true
    };

    vehicle.neonColor = {
        r: neons[0],
        g: neons[1],
        b: neons[2],
        a: 1
    };

    //Function.saveAppearance(vehicle)
}
*/


export function tpVehicle (veh, pos, rot, engine) {
    return new Promise((spawned) => {
        veh.setSyncedMeta('position', pos)
        if (rot) veh.setSyncedMeta('rotation', rot)
        else rot = {x: 0, y:0, z:0}

        const vehData = getVehData(veh)
        alt.log(vehData)
        spawnVehicle(vehData).then((newVeh) => {
            const engine = veh.engineOn
            setTimeout(() => {
                newVeh.engineOn = engine
            }, 500);
            veh.destroy()
            spawned(newVeh)
        })
    })
}

export function tpmVehicle (player, veh, pos) {
    player.spawn(pos)
    tpVehicle(veh, pos).then((newVeh) => {
        ////    setTimeout(alt.emitClient, 400, player, "vehicle:SetPlayerIn", newVeh)
        //  setTimeout(() => {
        //      alt.emitClient(player, 'vehicle:SetPlayerIn', (newVeh))    
        //  }, 400);
    })
}


/*
alt.onClient('vehicleToGarage:Found', (player, veh) => {
    const loc = Table.garage[0]
    const pos = loc.pos
    alt.log('init :', pos.z)
    const rot = loc.rot
    const enter = player.vehicle

    const newVeh = tpVehicle(veh, pos, rot)

    if (enter) {
        setTimeout(() => {
            alt.emitClient(player, 'vehicle:SetPlayerIn', (newVeh))
        }, 300);
    }
})
*/


export function getVehMod (veh) {
    let modData = []
    let n = modList.length
    for (let i=0 ; i<n ; i++)
        modData[i] = {mod: veh.getMod(i), count: veh.getModsCount(i)}
    return modData
}


export function getVehData (veh) {
    let vehData = {}
    const vehDataList = ['id', 'model', 'position', 'rotation', 'owner', 'appearance', 'garage', "modData"]
    for (const meta of vehDataList) vehData[meta] = veh.getSyncedMeta(meta)
    return vehData
}


export function getPersonnalVehData (player) { // return all vehcile player own
    let playerVehList = []
    const vehList = alt.Vehicle.all
    vehList.sort()
    vehList.forEach(veh => {
        if (veh.getSyncedMeta('owner') == player.name) playerVehList.push([veh.model, veh])
    })
    return playerVehList
}

