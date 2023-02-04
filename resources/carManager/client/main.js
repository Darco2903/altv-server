import * as alt from "alt-client";
import * as native from "natives";

import "./events";

//  const player = alt.Player.local;

//  if (player.vehicle) {
//      const speed = 4000;
//      native.setVehicleMaxSpeed(player.vehicle, speed);
//      native.setVehicleForwardSpeed(player.vehicle, speed);
//      native.setPlayerVehicleDamageModifier(player.vehicle, 0);
//      native.setVehicleDamageScale(player.vehicle, 0);
//      native.isVehicleStopped(player.vehicle);
//  }

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

//native.setVehicleKeepEngineOnWhenAbandoned(player.vehicle, false)
//  native.setVehicleStartupRevSound()
//  native.resetVehicleStartupRevSound()

//  function checkDoors(vehicle) {
//      let nbDoor = native.getNumberOfVehicleDoors(vehicle);
//      for (let doorId = 0; doorId < nbDoor; doorId++) {
//          if (native.getVehicleDoorAngleRatio(vehicle, doorId) != 0) {
//              console.log(doorId, true);
//              native.setVehicleDoorShut(vehicle, doorId, false);
//          }
//      }
//  }

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
