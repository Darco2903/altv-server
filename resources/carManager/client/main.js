import * as alt from "alt-client";
import * as native from "natives";

import "./carWebviews"

const player = alt.Player.local

alt.onServer("vehicle:setInto", () => native.setPedIntoVehicle(player, player.vehicle, -1))

alt.onServer("vehicle:nearest", () => {
    let pos = player.pos
    let vehId = native.getClosestVehicle(pos.x, pos.y, pos.z, 50, 0, 70)
    let veh = alt.Vehicle.getByScriptID(vehId)
    //alt.emitServer("vehicle:nearest", veh)
})


//  native.isVehicleInGarageArea(garageName, veh)
//  native.setVehicleStrong(veh, bool)
//  native.setVehicleForwardSpeed(veh, speed)
//  native.setVehicleTyreBurst(veh, index, onRim, ?)
//  native.setVehicleDoorsShut(veh, instant)
//  native.setVehicleDoorOpen(veh, doorId, loose, instant)
//  native.setVehicleTyresCanBurst(veh, toogle)    //get
//  native.setVehicleTyreFixed(veh, index)
//  native.setVehicleCanBeVisiblyDamaged(veh, bool)
//  native.setVehicleHasUnbreakableLights(veh, bool)
//  native.setVehicleRespectsLocksWhenHasDriver(veh, bool)
//  native.setVehicleDirtLevel(player.vehicle, 15) 0-15 //get
//  native.getVehicleDoorLockStatus(veh)
//  native.setAllowVehicleExplodesOnContact(veh, bool)
//  native.setVehicleUseAlternateHandling(veh, bool)
//  native.setVehicleHandlingOverride(veh, hash)
//  native.setVehicleGravity(veh, bool)

//  native.requestVehicleHighDetailModel(veh)
//  native.removeVehicleHighDetailModel(veh)
//  native.isVehicleHighDetail(veh)

//  native.setVehicleIndicatorLights()

alt.on("enteredVehicle", (vehicle, seat) => {
    native.setVehicleKeepEngineOnWhenAbandoned(vehicle, true)
    //checkDoors(vehicle)
})
//native.setVehicleKeepEngineOnWhenAbandoned(player.vehicle, false)
//  native.setVehicleStartupRevSound()
//  native.resetVehicleStartupRevSound()

function checkDoors (vehicle) {
    let nbDoor = native.getNumberOfVehicleDoors(vehicle)
    for (let doorId=0 ; doorId< nbDoor ; doorId++) {
        if (native.getVehicleDoorAngleRatio(vehicle, doorId) != 0) {
            console.log(doorId, true);
            native.setVehicleDoorShut(vehicle, doorId, false)
        }
        
    }
    
}

alt.on("keydown", (key) => {
    switch (true) {
        case key == 49 && !!player.vehicle:   //  key: & = 49
            const running = native.getIsVehicleEngineRunning(player.vehicle)
            native.setVehicleEngineOn(player.vehicle, !running, false, true)
            break;
    
        default:
            break;
    }
})


//  native.playVehicleDoorOpenSound(player.vehicle, 0)
//  setTimeout(() => {
//      native.playVehicleDoorCloseSound(player.vehicle, 0)
//  }, 1000);

//  for (let wheelIndex=0 ; wheelIndex<player.vehicle.wheelsCount ; wheelIndex++) {
//      player.vehicle.setWheelCamber(wheelIndex, -0.25)
//      player.vehicle.setWheelTrackWidth(wheelIndex, 1)
//  }
//  player.vehicle.setWheelTrackWidth(0, 0.95)
//  player.vehicle.setWheelTrackWidth(1, 0.95)


if (player.vehicle) {
    //  const speed = 4000
    //  native.setVehicleMaxSpeed(player.vehicle, speed)
    //  native.setVehicleForwardSpeed(player.vehicle, speed)
    //  native.setPlayerVehicleDamageModifier(player.vehicle, 0)
    //  native.setVehicleDamageScale(player.vehicle, 0)
}