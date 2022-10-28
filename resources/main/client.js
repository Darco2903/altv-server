import * as alt from 'alt-client'
import * as native from 'natives';
import * as load from './locations';

native.setPlayerControl(alt.Player.local.scriptID, true, 1)
native.setPlayerInvincible(alt.Player.local.scriptID, false)


//alt.on("resourceStart", () => {
    //import("./carManager/client/client")
//})


alt.onServer('load:Locations', () => {
    load.loadInteriors()
    load.loadCayoPericoIsland()
    //load.loadtrains()
})

alt.onServer('clock:Interact', (time, speed, started) => {
    if (!started) speed = 999999
    native.setClockTime(time.h, time.m, 0)
    alt.setMsPerGameMinute(speed)    
})

alt.onServer("weather:Set", (weather) => {
    alt.log(weather.toUpperCase())
    native.setWeatherTypeNow(weather.toUpperCase())
})


alt.onServer('playerDeath', () => {
    native.setPlayerControl(alt.Player.local.scriptID, true, 10000000)
})



alt.onServer('godmode', (bool) => {
    native.setPlayerInvincible(alt.Player.local.scriptID, bool)
})


alt.onServer('vehicle:SetPlayerIn', (vehicle) => {
    native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle, -1)
});


alt.onServer('clone', () => {
    native.clonePed(alt.Player.local.scriptID, true, true, true)
})


alt.on('keydown', (key) => {
    
    //µ / *
    if (key == 192) {
        native.setPedToRagdoll(alt.Player.local.scriptID, 1, 10000, 0, false, false, false)            
        native.setPlayerControl(alt.Player.local.scriptID, true, 1)
    }

    //A
    if (key == 65) {

    }
    //F
    if (key == 70) {
        
    }
    
    
    //Z
    if (key == 90) {
        /*
        var vehicle = alt.Player.local.vehicle
        var engine = vehicle.getMeta('engine')
        
        if (!engine) {
            
        }
        */
    }

});


alt.onServer('vehicle:AllExit', () => {
    native.taskEveryoneLeaveVehicle(alt.Player.local.vehicle.scriptID)
    native.taskLeaveVehicle(alt.Player.local.scriptID, alt.Player.local.vehicle.scriptID, 0)
})


alt.onServer('tpm:Player', () => {
    const veh = alt.Player.local.vehicle
    var waypoint = native.getFirstBlipInfoId(8);
    var coords = undefined
    if (waypoint != 0) {
        coords = native.getBlipInfoIdCoord(waypoint);
        var res = native.getGroundZFor3dCoord(coords.x, coords.y, coords.z + 100, undefined, undefined);
        console.log("ground: " + res)
        if (res[0] == false) {
            alt.emitServer('tpm:PlayerTPM', coords, false)
            setTimeout(() => {
                res = native.getGroundZFor3dCoord(coords.x, coords.y, coords.z + 100, undefined, undefined);
                coords = {x: coords.x, y: coords.y, z: res[1]}
                alt.emitServer('tpm:PlayerTPM', coords, veh)
            }, 200);
        } else {
            res = native.getGroundZFor3dCoord(coords.x, coords.y, coords.z + 100, undefined, undefined);
            coords = {x: coords.x, y: coords.y, z: res[1]}
            alt.emitServer('tpm:PlayerTPM', coords, veh)
        }
        
    }
})



alt.onServer('vehicle:Request', () => {
    //getClosestVehicle
    alt.emitServerRaw('vehicle:Found', vehicleNearRequest())
})


alt.onServer('vehicle:Repair', () => {
    var veh = vehicleNearRequest()
    alt.emitServer('vehicle:ToRepair', veh)
})

alt.onServer('vehicle:Enter', () => {
    var vehicle = vehicleNearRequest()
    native.setPedIntoVehicle(alt.Player.local.scriptID, vehicle, -1)
})

alt.onServer('vehicleToGarage:Request', () => {
    alt.emitServerRaw('vehicleToGarage:Found', vehicleNearRequest())
})



alt.onServer('getPlayers:PlayersList', () => {
    var playersList = alt.Player.all
    alt.emitServer('players:PlayersList', playersList)
})



function vehicleNearRequest () {        // Get vehicles near the player
    var vehList = alt.Vehicle.streamedIn
    const pos = alt.Player.local.pos

    for (var i = 0; i < vehList.length; i++) {
        vehList[i].distance = Math.sqrt((vehList[i].pos.x - pos.x)**2 + (vehList[i].pos.y - pos.y)**2 + (vehList[i].pos.z - pos.z)**2)
    }

    vehList.sort(function(a, b) {
        return a.distance - b.distance
    })
    if (vehList[0].distance < 50) {
        return vehList[0]
    }
    return
}
