//import * as alt from 'alt';
import * as alt from 'alt-server';
import * as chat from 'chat';
import { garages } from '../tables';
//import { spawnVehicle } from '../../carManager/server/functions';
import * as db from "database"

//import * as Function from '../../main/server/data/Functions'


let garageWaypoint = []
for (const name in garages) {
    const pos = garages[name].pos
    const waypoint = new alt.Checkpoint(48, pos.x, pos.y, pos.z-2, pos.w, 5, 255, 100, 0, 255)
    
    waypoint.setMeta('type', "garage") ; waypoint.setMeta('id', name) ; waypoint.dimension = 0
    garageWaypoint.push(waypoint)
}


function initGarage (player, garageName) {
    const data = {}
    data.player = player
    data.garage = garages[garageName]
    const parkPlace = data.garage.places

    db.selectData("Vehicle", ["id", "model", "appearance", "owner", "garage"], vehList => {
        var vehInGarage = []
        for (const vehData of vehList) {
            vehData.garage = JSON.parse(vehData.garage)
            if (vehData.garage) if (vehData.garage.inGarage) {
                if (vehData.garage.name == garageName) {
                    vehData.appearance = JSON.parse(vehData.appearance)
                    vehData.position = parkPlace[vehData.garage.place].pos
                    vehData.rotation = parkPlace[vehData.garage.place].rot
                    var initialPlaces = {}
                    spawnVehicle(vehData).then((veh) => {
                        vehInGarage[vehData.garage.place] = veh
                        initialPlaces[vehData.id] = vehData.garage.place
                    })
                }
            }
        }

        data.vehInGarage = vehInGarage
        data.initialPlaces = initialPlaces

        var exitWaypoint = []
        for (const exit of data.garage.exitPoints) {
            const e = new alt.Checkpoint(48, exit.x, exit.y, exit.z-1, exit.w, 1, 255, 200, 0, 200)
            e.setMeta("type", "exit")
            exitWaypoint.push(e)
        }

        data.exitWaypoint = exitWaypoint

        garageCheck(data)

    })
}



function garageCheck (data) {

    var garage = data.garage
    var parkPlace = garage.places
    var exitWaypoint = data.exitWaypoint
    var vehInGarage = data.vehInGarage
    var initialPlaces = data.initialPlaces
    var player = data.player
    var placeWaypoint = []
    //var parkedPlace
    //var inExit


    function enableWaypoint (enable) {
        if (enable && placeWaypoint.length < 1) createWaypoint()
        else if (!enable && placeWaypoint.length > 0) {deleteList(placeWaypoint) ; placeWaypoint = []}
    }

    function playerEnteredVehicle (player, veh) {
        enableWaypoint(true)
    }

    function playerLeftVehicle (player, veh) {
        enableWaypoint(false)
        //console.log(player, targetVehicle, seat)
        const id = veh.getSyncedMeta("id")
        const vehGarage = veh.getSyncedMeta("garage")
        //console.log(initialPlaces[id], vehGarage.place, initialPlaces[id] != vehGarage.place)
        if (initialPlaces[id] != vehGarage.place) {
            vehInGarage[initialPlaces[id]] = undefined
            //if (vehGarage.place == -1) vehGarage.place = null
            initialPlaces[id] = vehGarage.place
            //console.log(vehGarage.place, !isNaN(vehGarage.place))
            if (!isNaN(vehGarage.place)) vehInGarage[vehGarage.place] = veh
            db.updatePartialData(id, {garage: JSON.stringify(vehGarage)}, "Vehicle", callback => {})
        }
    }


    function deleteList (list) {
        if (list.length == 0) return
        for (const elem of list) {
            console.log(elem);
            if (elem) elem.destroy()
        }
            
    }

    function clearGarage () {
        for (var elem of [placeWaypoint, exitWaypoint, vehInGarage]) deleteList(elem)
        placeWaypoint = []
        exitWaypoint = []
        vehInGarage =  []
        alt.off("playerEnteredVehicle", playerEnteredVehicle)
        alt.off("playerLeftVehicle", playerLeftVehicle)
        alt.off("entityLeaveColshape", leaveColshape)
    }

    alt.on('playerEnteredVehicle', playerEnteredVehicle)
    alt.on('playerLeftVehicle', playerLeftVehicle)
    alt.on('entityLeaveColshape', leaveColshape)

    function leaveColshape (colshape, entity) {
        const type = colshape.getMeta("type")
        if (entity.type == 0) {
            if (type == "garage") clearGarage()
            if (type == "exit") alt.emitClient(entity, 'stopShow')
        }
        if (entity.type == 1 && type == "place") {
            alt.emitClient(player, "stopShow")
            var vehGarage = entity.getSyncedMeta("garage")
            vehGarage.inGarage = false ; vehGarage.place = null ; vehGarage.name = null
            entity.setSyncedMeta("garage", vehGarage)
        }
    }

    function createWaypoint () {
        placeWaypoint = []
        for (const index in parkPlace) {
            const pos = parkPlace[index].pos
            const w = new alt.Checkpoint(48, pos.x, pos.y, pos.z-1, 1, 1, 0, 0, 0, 100)
            w.setMeta("type", "place") ; w.setMeta("id", index) ; w.setMeta("garageName", garage.name)
            placeWaypoint.push(w)
        }
    }

    //alt.on("vehParked", vehParked)

    function vehParked (colshape) {
        console.log("vehParked")
        const index = colshape.getMeta("id")
        colshape.destroy()
        const pos = parkPlace[index].pos
        const w = new alt.Checkpoint(48, pos.x, pos.y, pos.z-1, 2, 2, 0, 255, 0, 150)
        w.setMeta("type", "place") ; w.setMeta("id", index)
        placeWaypoint[index] = w
    }

    function vehUnparked (colshape) {
        const index = colshape.getMeta("id")
        colshape.destroy()
        const pos = parkPlace[index].pos
        const w = new alt.Checkpoint(48, pos.x, pos.y, pos.z-1, 1, 1, 0, 0, 0, 100)
        w.setMeta("type", "place") ; w.setMeta("id", index)
        placeWaypoint[index] = w
        startListenEnter()
    }
/*
    function isVehParked (veh) {
        const p = isNaN(parkedPlace)
        for (const i in waypoint) {
            if (waypoint[i].isEntityIn(veh) && p) {
                waypoint[i].destroy()
                const pos = parkPlace[i].pos
                waypoint[i] = new alt.Checkpoint(48, pos.x, pos.y, pos.z-1, 2, 2, 0, 255, 0, 150)
                parkedPlace = i
                return i
            }

            if (!waypoint[i].isEntityIn(veh) && !p && i == parkedPlace){
                waypoint[i].destroy()
                const pos = parkPlace[i].pos
                waypoint[i] = new alt.Checkpoint(48, pos.x, pos.y, pos.z-1, 1, 1, 0, 0, 0, 100)
                parkedPlace = undefined
                return false
            }
        }
    }*/


    alt.on('resourceStop', () => {
        clearGarage()
    });

    
    /*
    var isInGarage = setInterval(() => {
        const a = garageWaypoint.isEntityIn(player)
        if (!a) {
            clearInterval(isInGarage)
            clearGarage()
            garageWaypoint.destroy()
        }
        
        //const veh = player.vehicle
        //if (veh) isVehParked(veh)
        //if (!veh && waypoint) enableWaypoint(false)
        
        //isPlayerInExit()
        
        //console.log(a)
    }, 10000);
    */
}


alt.onClient('exitGarage:Server', (player) => {
    console.log(player.name + " pressed E to exit")
})

alt.on('resourceStop', () => {
    for (const w of garageWaypoint) w.destroy()
    alt.off("entityEnterColshape", enterColshape)
});

function startListenEnter () {
    alt.on('entityEnterColshape', enterColshape);
}
startListenEnter()


function stopListenEnter () {
    alt.off('entityEnterColshape', enterColshape);
}

function enterColshape (colshape, entity) {
    const type = colshape.getMeta("type")
    if (entity.type == 0) {
        if (type == "garage") initGarage(entity, colshape.getMeta("id"))
        if (type == "exit") alt.emitClient(entity, 'exitGarage:Client')
    }

    if (entity.type == 1 && type == "place") {
        const player = entity.driver
        if (player) {
            alt.emitClient(player, "vehParked")
            var garage = entity.getSyncedMeta("garage")
            const placeId = colshape.getMeta("id")
            if (garage.place != placeId) {
                garage.place = placeId
                garage.inGarage = true
                garage.name = colshape.getMeta("garageName")
                entity.setSyncedMeta("garage", garage)
            }
        }
    }
}
